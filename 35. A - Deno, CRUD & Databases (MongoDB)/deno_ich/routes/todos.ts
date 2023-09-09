// We can import a router from Oak:
import { Router } from "https://deno.land/x/oak/mod.ts";

// Importing the ObjectId type
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

// Here we import the access to the DB from the helper. Then we can call it here wherever we need it.
import { getDb } from "../helpers/db_client.ts";

// Setting up router with Oak
const router = new Router();

// With this interface we define the type for our todos array:
interface ToDo {
	id?: string; // With a ? i can make this optional
	text: string;
}

// Route to get all todos: There is also a next whem needed. ctx gives access to request and response
router.get("/todos", async (ctx) => {
	// Accessing the DB and get all todos. Returns a promise
	const todos = await getDb().collection("todos-deno").find().toArray();

	// Because of the MongoDB ObjectId type we have to transform every todos object first. id has to be a string!
	const transformedTodos = todos.map(
		// Here we define the type of the object
		(todo: { _id: ObjectId; text: string }) => {
			return { id: todo._id.toString(), text: todo.text }; // $oid would also give back MongoDB id as a string
		}
	);

	// Sending back the response: We reach out to response object in ctx. Then we define the body and attach the todos array.
	// This will be sent automatically back. When we set it to an object Oak will transform it to JSON automatically
	ctx.response.body = { todos: transformedTodos };
});

// Route to add a todo:
router.post("/todos", async (ctx) => {
	// We extract the body: Oak automatically parses JSON body when detecting a JSON header
	const result = ctx.request.body();

	// The body() method above will return a promise! Therefore we need to set async to the route and use await here!
	const data = await result.value;

	// Creating a new todo by assigning our interface object type to it:
	const newTodo: ToDo = {
		// id: new Date().toISOString(), // Not needed anymore since DB creates own id
		text: data.text,
	};

	// Get access to DB and save a todo. Returns a promise
	const id = await getDb().collection("todos-deno").insertOne(newTodo);

	// Now we set the converted id as property of the newTodo object. $oid would also giive back MongoDB id as a string
	newTodo.id = id.toString();

	// Then we send back the response::
	ctx.response.body = {
		message: "Created new todo!",
		todo: newTodo,
	};
});

// Route to update a Todo. We replace the inccoming text of a Todo but keep the id
router.put("/todos/:todoId", async (ctx) => {
	// We extract the todoId. The ! in the eend makes clear that we know i will not be undefined
	const tid = ctx.params.todoId!;

	// We extract the body: Oak automatically parses JSON body when detecting a JSON header
	const result = ctx.request.body();
	// The body() method above will return a promise! Therefore we need to set async to the route and use await here!
	const data = await result.value;

	//
	await getDb()
		.collection("todos-deno")
		//  updateOne takes 2 arguments: first the filter with the id to find the todo (converted to ObjectId again)
		// and second the update instructtions. What has to be changed. Here we only have the text to change
		// Then returns a promise
		.updateOne({ _id: new ObjectId(tid) }, { $set: { text: data.text } });

	// If we don't find the todo we send back a response telling the user:
	ctx.response.body = { message: "Updated todo successfully!" };
});

// Route to delete a todo:
router.delete("/todos/:todoId", async (ctx) => {
	// We extract the todoId. The ! in the eend makes clear that we know i will not be undefined
	const tid = ctx.params.todoId!;
	// Here we delete the todo with deleteOne. It returns a promise
	await getDb()
		.collection("todos-deno")
		.deleteOne({ _id: new ObjectId(tid) });

	// Then send back the response:
	ctx.response.body = { message: "Todo deleted successfully!" };
});

// We import and export wth ES modules
export default router;
