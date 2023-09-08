import {
	MongoClient,
	Database,
	ObjectId,
	Collection,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";
// Importing dotenv
import { config } from "https://deno.land/x/dotenv/mod.ts";
const { DB_URI } = config();

const MONGODB_URI = DB_URI;
let db: Database;

export interface TodoDbSchema {
	_id?: ObjectId | string;
	text: string;
}

// CORE FEATURES

export async function connect() {
	const client = new MongoClient();
	await client.connect(MONGODB_URI);
	console.log("We are connected to the database", "\n");
	db = client.database("todos");
}

export const getDb = () => db;

function getTodosCollection(): Collection<TodoDbSchema> {
	const db = getDb();
	return db.collection<TodoDbSchema>("todos");
}

// FUNCTIONAL FEATURES

export async function getAllTodos(): Promise<TodoDbSchema[]> {
	return await getTodosCollection().find().toArray();
}

export async function insertOneTodo(todo: TodoDbSchema): Promise<ObjectId> {
	return (await getTodosCollection().insertOne(todo)) as ObjectId;
}

export async function updateOneTodo(
	todoId: string,
	todo: TodoDbSchema
): Promise<boolean> {
	const result = await getTodosCollection().updateOne(
		{ _id: new ObjectId(todoId) },
		{ $set: todo }
	);
	return result.modifiedCount > 0;
}

export async function deleteOneTodo(todoId: string): Promise<number> {
	return await getTodosCollection().deleteOne({ _id: new ObjectId(todoId) });
}
