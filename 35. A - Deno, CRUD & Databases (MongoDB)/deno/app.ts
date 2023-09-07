// This is a server with Oak:
import { Application } from "https://deno.land/x/oak/mod.ts";

// Importing the router
import todosRoutes from "./routes/todos.ts";

// Here we instanciate a new application from a class
const app = new Application();

// Test Middleware to show the async problem when using next:
app.use(async (ctx, next) => {
	console.log("Test middleware!");
	await next();
});

// Here we register the routes. Important is the routes() method on todosRoutes object
app.use(todosRoutes.routes());
// We need to register a socoond MW for the routes:This is needed to handle routes properly in Oak
app.use(todosRoutes.allowedMethods());

// Then listening on a port with top level await
await app.listen({ port: 8000 });
