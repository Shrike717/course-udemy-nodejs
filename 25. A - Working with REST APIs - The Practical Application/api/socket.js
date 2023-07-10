let io;

module.exports = {
	init: (httpserver) => {
		io = require("socket.io")(httpserver);
		return io;
	},
	getIo: () => {
		if (!io) {
			throw new Error("Socke.io not initialized!");
		}
		return io;
	},
};
