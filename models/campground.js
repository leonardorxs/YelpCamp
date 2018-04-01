const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
	name: {
		type: String,
		requrired: true,
		unique: true
	},
	image: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	date: { type: Date, default: Date.now },
	price: { type: Number, min: 0, default: 0.00 },
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