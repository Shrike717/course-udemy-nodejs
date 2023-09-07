// This is a server with Oak:
import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

// Importing the router
import todosRoutes from "./routes/todos.ts";

// Here we instanciate a new application from a class
const app = new Application();

// Test Middleware to show the async problem when using next:
app.use(async (ctx, next) => {
	console.log("Test middleware!");
	await next();
});

// MW to enable all CORS
app.use(oakCors()); // Enable CORS for All Routes

// // MW setting the CORS headers: we need these 3 essential headers set on every response
// app.use(async (ctx, next) => {
// 	ctx.response.headers.set("Access-Control-Allow-Origin", "*"); // * Every domain is allowed
// 	ctx.response.headers.set(
// 		"Access-Control-Allow-Method",
// 		"GET, POST, PUT, DELETE, OPTIONS"
// 	); // * These methods are allowed
// 	ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type"); // * These headers are allowed from the FE. Needed to send JSON bodies
// 	await next();
// });

// Here we register the routes. Important is the routes() method on todosRoutes object
app.use(todosRoutes.routes());
// We need to register a socoond MW for the routes:This is needed to handle routes properly in Oak
app.use(todosRoutes.allowedMethods());

// Then listening on a port with top level await
await app.listen({ port: 8000 });
