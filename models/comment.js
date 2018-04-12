const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	text: {
		type: String,
		trim: true
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: {
			type: String,
			minlength: [3, "O nome de usuário deve ter entre 3 e 12 caracteres."],
			maxlength: [12, "O nome de usuário deve ter entre 3 e 12 caracteres."]
		}
	},
	date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);