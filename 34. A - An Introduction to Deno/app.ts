// This is a server with Oak:
import { Application } from "https://deno.land/x/oak/mod.ts";

// Here we instanciate a new application from a class
const app = new Application();

// Here we register a middleware with  the use() method
app.use((ctx, next) => {
	ctx.response.body = "Hello World! (From Oak)";
});

// Then listening on a port with top level await
await app.listen({ port: 8000 });
