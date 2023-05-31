const mongoose = require("mongoose");
// Constructor to  create a Schema:
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        // required: true
        default: "I am new!"
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
});

module.exports = mongoose.model("User", userSchema);
