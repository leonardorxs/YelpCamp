var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
<<<<<<< HEAD
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
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