const mongoose = require("mongoose");

<<<<<<< HEAD
const commentSchema = mongoose.Schema({
=======
var commentSchema = mongoose.Schema({
<<<<<<< HEAD
>>>>>>> 67757274d3af65623847d602294158d326e058db
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		username: String
	},
	date: { type: Date, default: Date.now }
=======
    text: String,
    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
    },
    date: { type: Date, default: Date.now }
>>>>>>> e9c90b176f208d0e6d24e7d4b9a1039b9d9b063d
});

module.exports = mongoose.model("Comment", commentSchema);