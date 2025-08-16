import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		completed: { type: Boolean, default: false },
		user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
	},
	{
		timestamps: true
	}
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
