// We can import a router from Oak:
import { Router } from "https://deno.land/x/oak/mod.ts";

// Setting up router with Oak
const router = new Router();

// With this interface we define the type for our todos array:
interface ToDo {
	id: string;
	text: string;
}

// For this dummy REST API we store the Todos here. Only in memory.
let todos: ToDo[] = []; // We define the Array with our interface ToDos

// Route to get all todos: There is also a next whem needed. ctx gives access to request and response
router.get("/todos", (ctx) => {
	// Sending back the response: We reach out to response object in ctx. Then we define the body and attach the todos array.
	// This will be sent automatically back. When we set it to an object Oak will transform it to JSON automatically
	ctx.response.body = { todos: todos };
});

// Route to add a todo:
router.post("/todos", async (ctx) => {
	// We extract the body: Oak automatically parses JSON body when detecting a JSON header
	const result = ctx.request.body();
	// console.log(result);
	// The body() method above will return a promise! Therefore we need to set async to the route and use await here!
	const data = await result.value;
	// console.log(data);
	// Creating a new todo by assigning our interface object type to it:
	const newTodo: ToDo = {
		id: new Date().toISOString(),
		text: data.text,
	};
	// Then pushing the new todo into the array:
	todos.push(newTodo);
	// Then we send back the response::
	ctx.response.body = {
		message: "Created new todo!",
		todo: newTodo,
		todos: todos,
	};
});

// Route to update a Todo. We replace the inccoming text of a Todo but keep the id
router.put("/todos/:todoId", async (ctx) => {
	// We extract the todoId:
	const tid = ctx.params.todoId;

	// We extract the body: Oak automatically parses JSON body when detecting a JSON header
	const result = ctx.request.body();
	// The body() method above will return a promise! Therefore we need to set async to the route and use await here!
	const data = await result.value;

	// Now we have to find the index of the todo in our array so that we can update it:
	// We coompare the id of every todo in the array with the incoming id. If it is equal we get true and find the index
	const todoIndex = todos.findIndex((todo) => {
		return todo.id === tid;
	});

	// Now we check if todoIndex is set
	if (todoIndex >= 0) {
		// Updating the todo:
		todos[todoIndex] = { id: todos[todoIndex].id, text: data.text };
		// And then return the response. We NEED an explicit return here! Otherwise the error response will be sent!
		return (ctx.response.body = { message: "Updated todo!", todos: todos });
	}
	// If we don't find the todo we send back a response telling the user:
	ctx.response.body = { message: "No Todo with this id found!" };
});

// Route to delete a todo:
router.delete("/todos/:todoId", (ctx) => {
	// Here we want to overwrite the todos array without the todo we want to delete:
	// If the todo id of the todo in the array is NOT the id of todo we want to delete it becomes true. Todo passes
	todos = todos.filter((todoItem) => todoItem.id !== ctx.params.todoId);

	// Then send back the response:
	ctx.response.body = { message: "Todo deleted successfully!", todos: todos };
});

// We import and export wth ES modules
export default router;
