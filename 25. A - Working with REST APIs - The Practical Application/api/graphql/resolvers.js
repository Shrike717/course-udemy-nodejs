// A resolver gives back the data. Like controller in REST
module.exports = {
	hello() {
		return {
			text: "Hello World!",
			views: 12345,
		};
	},
};
