import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true },
		password: { type: String, required: true },
		avatarUrl: { type: String, default: "/default-avatar.png" },
	},
	{
		timestamps: true
	}
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
