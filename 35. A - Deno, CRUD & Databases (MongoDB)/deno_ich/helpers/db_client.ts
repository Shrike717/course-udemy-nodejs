// Importing the mongo client from file
import {
	MongoClient,
	Database,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";
// Importing dotenv
import { config } from "https://deno.land/x/dotenv/mod.ts";
const { DB_URI } = config();

// Settting up db type variable with data type Database imported from mongo:
let db: Database;

// Wrapping the connect part into a function we can call from the file app.ts
export async function connect() {
	// We instanciate the imported mongo client
	const client = new MongoClient();

	//  Then we use the clent object to connect with a srv url
	await client.connect(DB_URI);

	console.log("We are connected to the database", "\n");

	// Here we access the collection. We HAVE to use an explicit return!
	return (db = client.database("todos-deno"));
}

// Wrapping the access to the DB part into a function we can call from the file app.ts
export function getDb() {
	return db;
}
