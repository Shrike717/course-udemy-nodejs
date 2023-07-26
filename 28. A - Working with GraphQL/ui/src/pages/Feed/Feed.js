import React, { Component, Fragment } from "react";

// import openSocket from "socket.io-client";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

class Feed extends Component {
	state = {
		isEditing: false,
		posts: [],
		totalPosts: 0,
		editPost: null,
		status: "",
		postPage: 1,
		postsLoading: true,
		editLoading: false,
	};

	componentDidMount() {
		const graphqlQuery = {
			query: `
            {
                user {
                    status
                }
            }
            `,
		};
		fetch("http://localhost:8080/graphql", {
			method: "POST",
			headers: {
				// Header to append the JWT Token
				Authorization: "Bearer " + this.props.token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(graphqlQuery),
		})
			.then((res) => {
				return res.json();
			})
			.then((resData) => {
				if (resData.errors) {
					throw new Error("Fetching status failed");
				}
				this.setState({ status: resData.data.user.status });
			})
			.catch(this.catchError);

		this.loadPosts();
	}

	loadPosts = (direction) => {
		// console.log(this.props.token);
		if (direction) {
			this.setState({ postsLoading: true, posts: [] });
		}
		let page = this.state.postPage; // Current page. Default 1. Gets incremented and decremented
		if (direction === "next") {
			page++;
			this.setState({ postPage: page });
		}
		if (direction === "previous") {
			page--;
			this.setState({ postPage: page });
		}

		const graphqlQuery = {
			query: `
            {
                getPosts (page: ${page}){
                    totalPosts
                    posts {
                        _id
                        title
                        content
                        imageUrl
                        creator {
                            name
                        }
                        createdAt
                    }
                }
            }
            `,
		};

		fetch("http://localhost:8080/graphql", {
			method: "POST",
			headers: {
				// Header to append the JWT Token
				Authorization: "Bearer " + this.props.token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(graphqlQuery),
		}) // Endpoint to fetch all posts with query for pagination
			.then((res) => {
				return res.json();
			})
			.then((resData) => {
				// If there are errors throw new error
				if (resData.errors) {
					throw new Error("Fetching posts failed");
				}
				this.setState(
					{
						posts: resData.data.getPosts.posts.map((post) => {
							return {
								...post,
								imagePath: post.imageUrl,
							};
						}),
						totalPosts: resData.data.getPosts.totalPosts,
						postsLoading: false,
					},
					() => {
						// console.log(this.state.posts);
					}
				);
			})
			.catch(this.catchError);
	};

	statusUpdateHandler = (event) => {
		event.preventDefault();
		const graphqlQuery = {
			query: `
                mutation {
                    updateStatus(status: "${this.state.status}") {
                        status
                    }
                }
            `,
		};
		fetch("http://localhost:8080/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Header to append the JWT Token
				Authorization: "Bearer " + this.props.token,
			},
			body: JSON.stringify(graphqlQuery),
		})
			.then((res) => {
				return res.json();
			})
			.then((resData) => {
				// If there are errors throw new error
				if (resData.errors) {
					throw new Error("Updating status failed");
				}
				console.log(resData);
			})
			.catch(this.catchError);
	};

	newPostHandler = () => {
		this.setState({ isEditing: true });
	};

	startEditPostHandler = (postId) => {
		this.setState((prevState) => {
			const loadedPost = {
				...prevState.posts.find((p) => p._id === postId),
			};

			return {
				isEditing: true,
				editPost: loadedPost,
			};
		});
	};

	cancelEditHandler = () => {
		this.setState({ isEditing: false, editPost: null });
	};

	finishEditHandler = (postData) => {
		this.setState({
			editLoading: true,
		});
		// Set up data (with image!) as JS form-data. Creates a multipart/form-data; header automatcally
		const formData = new FormData();
		formData.append("image", postData.image);
		// If we are  editing we append the imageUrl of the old image
		if (this.state.editPost) {
			formData.append("oldPath", this.state.editPost.imagePath);
		}
		// Request to send the image to REST API endpoint and getting back imageUrl to then use in Query request with GQ below
		return fetch("http://localhost:8080/post-image", {
			method: "PUT",
			headers: {
				// Header to append the JWT Token
				Authorization: "Bearer " + this.props.token,
			},
			body: formData,
		})
			.then((res) => res.json())
			.then((fileResData) => {
				// Now we can extract imageUrl
				const imageUrl = fileResData.filePath;
				let graphqlQuery = {
					query: `
                        mutation {
                            createPost(
                                postInput: {title: "${postData.title}", content: "${postData.content}", imageUrl: "${imageUrl}"}
                            ) {
                                _id
                                title
                                content
                                imageUrl
                                creator {
                                    name
                                }
                                createdAt
                                updatedAt
                            }
                        }
                    `,
				};
				// Changing grraphqlQuuery depending on creatin a new post or  editing post:
				if (this.state.editPost) {
					graphqlQuery = {
						query: `
                            mutation {
                                updatePost(id: "${this.state.editPost._id}",
                                    postInput: {title: "${postData.title}", content: "${postData.content}", imageUrl: "${imageUrl}"}
                                ) {
                                    _id
                                    title
                                    content
                                    imageUrl
                                    creator {
                                        name
                                    }
                                    createdAt
                                    updatedAt
                                }
                            }
                        `,
					};
				}

				return fetch("http://localhost:8080/graphql", {
					// Configuring request to GQ with user data from input modal:
					method: "POST",
					headers: {
						// Header to append the JWT Token
						Authorization: "Bearer " + this.props.token,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(graphqlQuery),
				});
			})
			.then((res) => {
				return res.json(); // Extracting response body from JSON to JS
			})
			.then((resData) => {
				console.log(resData);
				// If there are errors in the errors array then gget first error and its status
				if (resData.errors && resData.errors[0].status === 422) {
					throw new Error(
						"Validation failed. Make sure the email address isn't used yet!"
					);
				}
				// If there are other errors throw new error
				if (resData.errors) {
					throw new Error("User login failed");
				}
				// Extracting the response depending wether we are creatin or editing a post:
				let mutationResult = "createPost";
				if (this.state.editPost) {
					mutationResult = "updatePost";
				}
				const post = {
					// Creating new / updated post with extracted data coming from BE
					_id: resData.data[mutationResult]._id,
					title: resData.data[mutationResult].title,
					content: resData.data[mutationResult].content,
					creator: resData.data[mutationResult].creator,
					imagePath: resData.data[mutationResult].imageUrl,
					createdAt: resData.data[mutationResult].createdAt,
				};
				// Code to render a new post immediately:
				this.setState((prevState) => {
					let updatedPosts = [...prevState.posts];
					if (prevState.editPost) {
						const postIndex = prevState.posts.findIndex(
							(p) => p._id === prevState.editPost._id
						);
						updatedPosts[postIndex] = post;
					} else {
						updatedPosts.pop();
						updatedPosts.unshift(post);
					}
					return {
						posts: updatedPosts,
						isEditing: false,
						editPost: null,
						editLoading: false,
					};
				});
				this.loadPosts(); // My doing. After coding image upload posts weren't fetched othewise
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					isEditing: false,
					editPost: null,
					editLoading: false,
					error: err,
				});
			});
	};

	statusInputChangeHandler = (input, value) => {
		this.setState({ status: value }, () => {
			// console.log(value);
		});
	};

	deletePostHandler = (postId) => {
		this.setState({ postsLoading: true });
		const graphqlQuery = {
			query: `
                mutation {
                    deletePost(id: "${postId}")
                }
            `,
		};
		fetch("http://localhost:8080/graphql", {
			method: "POST",
			headers: {
				// Header to append the JWT Token
				Authorization: "Bearer " + this.props.token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(graphqlQuery),
		})
			.then((res) => {
				console.log(res);
				return res.json();
			})
			.then((resData) => {
				if (resData.errors) {
					throw new Error("Deleting a post failed!");
				}
				console.log(resData);
				this.loadPosts(); // Reloading posts (not page) for websocket
				// this.setState((prevState) => {
				// 	const updatedPosts = prevState.posts.filter(
				// 		(p) => p._id !== postId
				// 	);
				// 	return { posts: updatedPosts, postsLoading: false };
				// });
			})
			.catch((err) => {
				console.log(err);
				this.setState({ postsLoading: false });
			});
	};

	errorHandler = () => {
		this.setState({ error: null });
	};

	catchError = (error) => {
		this.setState({ error: error });
	};

	render() {
		return (
			<Fragment>
				<ErrorHandler
					error={this.state.error}
					onHandle={this.errorHandler}
				/>
				<FeedEdit
					editing={this.state.isEditing}
					selectedPost={this.state.editPost}
					loading={this.state.editLoading}
					onCancelEdit={this.cancelEditHandler}
					onFinishEdit={this.finishEditHandler}
				/>
				<section className="feed__status">
					<form onSubmit={this.statusUpdateHandler}>
						<Input
							type="text"
							placeholder="Your status"
							control="input"
							onChange={this.statusInputChangeHandler}
							value={this.state.status}
						/>
						<Button mode="flat" type="submit">
							Update
						</Button>
					</form>
				</section>
				<section className="feed__control">
					<Button
						mode="raised"
						design="accent"
						onClick={this.newPostHandler}
					>
						New Post
					</Button>
				</section>
				<section className="feed">
					{this.state.postsLoading && (
						<div style={{ textAlign: "center", marginTop: "2rem" }}>
							<Loader />
						</div>
					)}
					{this.state.posts.length <= 0 &&
					!this.state.postsLoading ? (
						<p style={{ textAlign: "center" }}>No posts found.</p>
					) : null}
					{!this.state.postsLoading && (
						<Paginator
							onPrevious={this.loadPosts.bind(this, "previous")}
							onNext={this.loadPosts.bind(this, "next")}
							lastPage={Math.ceil(this.state.totalPosts / 2)}
							currentPage={this.state.postPage}
						>
							{this.state.posts.map((post) => (
								<Post
									key={post._id}
									id={post._id}
									author={post.creator.name}
									date={new Date(
										post.createdAt
									).toLocaleDateString("en-US")}
									title={post.title}
									image={post.imageUrl}
									content={post.content}
									onStartEdit={this.startEditPostHandler.bind(
										this,
										post._id
									)}
									onDelete={this.deletePostHandler.bind(
										this,
										post._id
									)}
								/>
							))}
						</Paginator>
					)}
				</section>
			</Fragment>
		);
	}
}

export default Feed;
