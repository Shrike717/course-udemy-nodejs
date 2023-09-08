import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const client = new MongoClient();

try {
	await client.connect(
		"mongodb+srv://Daniel:Jjr0hoWrjcL55B0I@cluster0.igzmsfw.mongodb.net/todos?authMechanism=SCRAM-SHA-1"
	);

	console.log("Connected to database");
} catch (err) {
	console.log("Error connecting to database", err);
}

const db = client.database("todos");

export default db;
