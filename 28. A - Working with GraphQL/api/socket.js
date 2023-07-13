const { Server } = require("socket.io");
let io;

module.exports = {
	init: (httpServer) => {
		io = new Server(httpServer, {
			cors: {
				// We have o set CORS headers
				origin: "*",
				allowedHeaders: "*",
				credentials: true,
			},
		});
		return io;
	},
	getIo: () => {
		if (!io) {
			throw new Error("Socket.io not initialized!");
		}
		return io;
	},
};
