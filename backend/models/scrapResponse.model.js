import mongoose from "mongoose";

const scrapResponseSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		scrap:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Scrap",
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		paymentMethod: {
			type: String,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected","auto Rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

const ScrapResponse = mongoose.model("ScrapResponse", scrapResponseSchema);

export default ScrapResponse;
