import { Application } from "https://deno.land/x/oak/mod.ts";
import { connect } from "./helpers/db_client.ts";

import todosRoutes from "./routes/todos.ts";

await connect();

const app = new Application();

app.use(async (ctx, next) => {
	const {
		method,
		url: { href },
	} = ctx.request;
	if (method !== "OPTIONS")
		console.log(
			"Some middleware. request.method = ",
			method,
			" & request.url.href = ",
			href,
			"\n"
		);
	await next();
});

app.use(async (ctx, next) => {
	// For the outgoing response
	ctx.response.headers.set("Access-Control-Allow-Origin", "*"); // Controls which other domains will be allowed to access our resources (any domain in this case). So any other domain may send the request
	ctx.response.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE"
	); // Controls which kind of HTTP methods can be used for requests being sent to this back end
	ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type"); // Controls which headers may be set by the frontend when it requests dats
	await next(); // We must add await here if the next middleware in line is asynchronous (and the route middlewares are async)
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });
