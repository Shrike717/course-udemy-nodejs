import { Router } from "https://deno.land/x/oak/mod.ts";
import {
	TodoDbSchema,
	getAllTodos,
	insertOneTodo,
	updateOneTodo,
	deleteOneTodo,
} from "../helpers/db_client.ts";

const router = new Router();

router.get("/todos", async (ctx) => {
	const mongoDbTodos = await getAllTodos();
	const todos = mongoDbTodos.map((mongoDbTodo: TodoDbSchema) => {
		return { id: mongoDbTodo._id!.toString(), text: mongoDbTodo.text }; // $oid holds the same value as a string
	});

	ctx.response.body = { todos }; // {id: string, text: string }[]
});

router.post("/todos", async (ctx) => {
	const { request, response } = ctx;
	const body = request.body();
	const { text } = await body.value;

	const newTodo: TodoDbSchema = { text };
	const insertedObjectId = await insertOneTodo(newTodo);

	if (insertedObjectId) {
		response.body = {
			message: "The todo was successfully created!",
			todo: { ...newTodo, id: insertedObjectId.toString() },
		};
	} else {
		response.status = 500;
		response.body = { message: "The todo was not created!" };
	}
});

router.put("/todos/:todoId", async (ctx) => {
	const {
		request,
		response,
		params: { todoId },
	} = ctx;
	const body = request.body();
	const { text } = await body.value;

	const newTodo: TodoDbSchema = { text };
	const wasUpdated: boolean = await updateOneTodo(todoId, newTodo);

	if (wasUpdated) {
		response.body = {
			message: "The todo was successfully updated!",
			todo: newTodo,
		};
	} else {
		response.status = 500;
		response.body = { message: "The todo was not updated!" };
	}
});

router.delete("/todos/:todoId", async (ctx) => {
	const {
		response,
		params: { todoId },
	} = ctx;

	const deletedAmount: number = await deleteOneTodo(todoId);

	if (deletedAmount > 0) {
		response.body = { message: "The todo was successfully deleted!" };
	} else {
		response.status = 500;
		response.body = { message: "The todo was not deleted!" };
	}
});

export default router;
