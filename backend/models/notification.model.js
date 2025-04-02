import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["follow", "like","offer","deal","comment","like scrap","offer Accepted","deal Accepted","deal rejected","offer rejected"],
		},
		relatedUser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		relatedScrap: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Scrap",
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

