import connectToDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
	try {
		await connectToDB();
		const token = req.cookies.get("token")?.value;
		const data = verifyToken(token);
		if (!data) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const task = await Task.findById(params.id);
		if (!task) return NextResponse.json({ error: "Not Found" }, { status: 404 });
		if (task.user.toString() !== data.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

		const body = await req.json();
		task.title = body.title ?? task.title;
		task.description = body.description ?? task.description;
		if (typeof body.completed === "boolean") task.completed = body.completed;
		await task.save();
		return NextResponse.json({ task });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function DELETE(req, { params }) {
	try {
		console.log("DELETE request for task:", params.id);
		
		// Validate the ID parameter
		if (!params.id || typeof params.id !== 'string') {
			console.log("Invalid ID parameter:", params.id);
			return NextResponse.json({ 
				error: "Invalid task ID" 
			}, { status: 400 });
		}

		await connectToDB();
		console.log("Connected to MongoDB");
		
		const token = req.cookies.get("token")?.value;
		console.log("Token present:", !!token);
		
		const data = verifyToken(token);
		if (!data) {
			console.log("Token verification failed");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.log("User ID from token:", data.id);

		const task = await Task.findById(params.id);
		if (!task) {
			console.log("Task not found:", params.id);
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}
		console.log("Task found, user ID:", task.user.toString());
		
		if (task.user.toString() !== data.id) {
			console.log("User mismatch. Task user:", task.user.toString(), "Token user:", data.id);
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Use deleteOne() instead of deprecated remove()
		const deleteResult = await Task.deleteOne({ _id: params.id });
		console.log("Delete result:", deleteResult);
		
		if (deleteResult.deletedCount === 0) {
			console.log("No task was deleted");
			return NextResponse.json({ 
				error: "Task could not be deleted" 
			}, { status: 500 });
		}
		
		console.log("Task deleted successfully");
		return NextResponse.json({ 
			success: true, 
			message: "Task deleted successfully",
			deletedTaskId: params.id
		});
	} catch (err) {
		console.error("Delete task error:", err);
		return NextResponse.json({ 
			error: "Failed to delete task. Please try again." 
		}, { status: 500 });
	}
}
