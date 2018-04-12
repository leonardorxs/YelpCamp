const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		unique: true,
		minlength: [3, "O nome do acampamento deve ter entre 3 e 30 caracteres" ],
		maxlength: [30, "O nome do acampamento deve ter entre 3 e 30 caracteres"]
	},
	image: {
		type: String,
		trim: true,
		required: true
	},
	description: {
		type: String,
		required: true,
		trim: true,
		minlength: [3, "O comentário deve ter entre 3 e 300 caracteres" ],
		maxlength: [300, "O o comentário deve ter entre 3 e 300 caracteres"]
	},
	date: { 
		type: Date, 
		default: Date.now 
	},
	price: { 
		type: String, 
		trim: true,
		default: 0 , 
		min: 0,
		max: 999
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		username: String
	},
    comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);