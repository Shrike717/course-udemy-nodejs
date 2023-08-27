import { Router } from "express";

// Importing the object type for a todo
import { ToDo } from "../models/todos";

// For this dummy REST API we store the Todos here. Only in memory.
const todos: ToDo[] = []; // We define the Array with our interface ToDo

const router = Router();

// Registering the routes wee need:
// Fetching all todos:
router.get("/", (req, res, next) => {
	res.status(200).json({ todos: todos });
});

// Route to add a Todo:
router.post("/todo", (req, res, next) => {
	// Create a new Todo:
	const newTodo: ToDo = {
		id: new Date().toISOString(),
		text: req.body.text,
	};
	// Then pushing the new Todo to the todos array:
	todos.push(newTodo);
	// And sending back a response:
	res.status(201).json({
		message: "Added new todo",
		todo: newTodo,
		todos: todos,
	});
});

export default router;
