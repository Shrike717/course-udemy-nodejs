import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
	state = {
		title: "",
		author: "",
		date: "",
		image: "",
		content: "",
	};

	// Similar to useEffect hook when component renders
	componentDidMount() {
		const postId = this.props.match.params.postId;
		// The query object:
		const graphqlQuery = {
			query: `
                query FetchSinglePost($postId: ID!){
                    getPost (id: $postId) {
                        title
                        content
                        creator {
                            name
                        }
                        imageUrl
                        createdAt
                    }
                }
                `,
			variables: {
				postId: postId,
			},
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
				console.log(resData);
				// If there are errors throw new error
				if (resData.errors) {
					throw new Error("Fetching post failed");
				}
				this.setState({
					// Sets all PoS with extracted data from post in reponse body coming from DB
					title: resData.data.getPost.title,
					author: resData.data.getPost.creator.name,
					image:
						"http://localhost:8080/" +
						resData.data.getPost.imageUrl,
					date: new Date(
						resData.data.getPost.createdAt
					).toLocaleDateString("en-US"),
					content: resData.data.getPost.content,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	render() {
		return (
			// Rendering post with JS expressions showing updated PoS
			<section className="single-post">
				<h1>{this.state.title}</h1>
				<h2>
					Created by {this.state.author} on {this.state.date}
				</h2>
				<div className="single-post__image">
					<Image contain imageUrl={this.state.image} />
				</div>
				<p>{this.state.content}</p>
			</section>
		);
	}
}

export default SinglePost;
