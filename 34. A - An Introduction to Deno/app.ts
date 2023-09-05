// serve has been moved to the Ruuntime API. The code would be:
// It listens on port 8000 per default and there is no need to import it.
Deno.serve((_req) => new Response("Hello, World!"));

// **********************************************************************************

// // This is the method that replaces serve in the standard library now:
// // This is the example of using serverListen as shown in the docs:

// // Imports the function serverListener and caches it for the next time
// import { serveListener } from "https://deno.land/std@0.201.0/http/server.ts";

// // Then we listen on the port by creating a listener
// const listener = Deno.listen({ port: 3000 });

// console.log("server listening on http://localhost:3000");

// // This takes the listener and handles requests on this listener with a given handler:
// await serveListener(listener, () => {
// 	const body = "Hello, World!";

// 	return new Response(body, { status: 200 });
// });

// **********************************************************************************

// This code comes from the Q&A section of the course:

import { serveListener } from "https://deno.land/std@0.201.0/http/server.ts";

const listener = Deno.listen({ port: 3000 });
console.log("Server is running on http://localhost:3000/");

for await (const conn of listener) {
	serveConnection(conn);
}

async function serveConnection(conn: Deno.Conn) {
	const httpConn = Deno.serveHttp(conn);
	for await (const requestEvent of httpConn) {
		const { request } = requestEvent;
		requestEvent.respondWith(new Response("Hello World!"));
	}
}
