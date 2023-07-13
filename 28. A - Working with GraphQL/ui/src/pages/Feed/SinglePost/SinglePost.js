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
		fetch("http://localhost:8080/feed/post/" + postId, {
			headers: {
				// Header to append the JWT Token
				Authorization: "Bearer " + this.props.token,
			},
		})
			.then((res) => {
				if (res.status !== 200) {
					throw new Error("Failed to fetch status");
				}
				return res.json();
			})
			.then((resData) => {
				this.setState({
					// Sets all PoS with extracted data from post in reponse body coming from DB
					title: resData.post.title,
					author: resData.post.creator.name,
					image: "http://localhost:8080/" + resData.post.imageUrl,
					date: new Date(resData.post.createdAt).toLocaleDateString(
						"en-US"
					),
					content: resData.post.content,
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
