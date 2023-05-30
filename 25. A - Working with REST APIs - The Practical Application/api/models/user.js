const mongoose = require("mongoose");
// Constructor to  create a Schema:
const Schema = mongoose.Schema;

const userScheme = new Schema({
	email: {
		type: String,
		required: true,
	},
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
});

module.exports = mongoose.model("User", postSchema);
