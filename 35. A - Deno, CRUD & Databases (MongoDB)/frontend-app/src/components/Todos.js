import React, { useState, useEffect, useCallback } from "react";

import "./Todos.css";

const Todos = () => {
	const [todos, setTodos] = useState([]); // The array for all todos
	const [editedTodo, setEditedTodo] = useState(); // State if we edit a todo
	const [enteredText, setEnteredText] = useState(""); // State for input control!

	const getTodos = useCallback(async () => {
		try {
			const response = await fetch("http://localhost:8000/todos");
			const todosData = await response.json();
			setTodos(todosData.todos);
		} catch (err) {
			// Error handling would be implemented here
			console.log(err);
		}
	}, []);

	useEffect(() => {
		getTodos();
	}, [getTodos]);

	// If state editedTodo changes, it sets the updated text tto state enteredText
	useEffect(() => {
		if (editedTodo) {
			setEnteredText(editedTodo.text);
		}
	}, [editedTodo]);

	// Sets state editedTodo to true
	const startEditHandler = (todo) => {
		setEditedTodo(todo);
	};

	// Deletes a todo
	const deleteTodoHandler = async (todoId) => {
		const response = await fetch("http://localhost:8000/todos/" + todoId, {
			method: "DELETE",
		});
		const data = await response.json();

		console.log(data);
		getTodos();
	};

	// Controlling the input field
	const inputHandler = (event) => {
		setEnteredText(event.target.value);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		setEditedTodo(null);
		setEnteredText("");

		let url = "http://localhost:8000/todos";
		let method = "POST";

		// In case we edit the todo it changes url and method
		if (editedTodo) {
			url = url + "/" + editedTodo.id;
			method = "PUT";
		}
		const response = await fetch(url, {
			method,
			body: JSON.stringify({
				text: enteredText,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json(); // Parsing JSON response
		console.log(data);
		getTodos(); // Gets todo list again
	};

	return (
		<React.Fragment>
			<div className="todos__form">
				<form onSubmit={submitHandler}>
					<label>Todo Text</label>
					<input
						type="text"
						value={enteredText} // Taking control of input field
						onChange={inputHandler} // Sets every char into the enteredText state
					/>
					<button type="submit">
						{/* Changes button */}
						{editedTodo ? "Edit" : "Add"} Todo
					</button>
				</form>
			</div>
			{todos && todos.length > 0 && (
				// Mapping over todos and displaying them
				<ul className="todos__list">
					{todos.map((todo) => (
						<li key={todo.id}>
							<span>{todo.text}</span>
							<div className="todo__actions">
								<button
									onClick={startEditHandler.bind(null, todo)} // Sends todo object we want to edit
								>
									Edit
								</button>
								<button
									onClick={deleteTodoHandler.bind(
										null,
										todo.id
									)} // Sends todo object id we want to delete
								>
									Delete
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</React.Fragment>
	);
};

export default Todos;
