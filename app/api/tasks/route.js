import connectToDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		console.log("GET /api/tasks - Starting request");
		await connectToDB();
		console.log("GET /api/tasks - Connected to MongoDB");
		
		const token = req.cookies.get("token")?.value;
		console.log("GET /api/tasks - Token present:", !!token);
		
		const data = verifyToken(token);
		if (!data) {
			console.log("GET /api/tasks - Token verification failed");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.log("GET /api/tasks - User ID:", data.id);

		const tasks = await Task.find({ user: data.id }).sort({ createdAt: -1 });
		console.log("GET /api/tasks - Found tasks:", tasks.length);
		
		return NextResponse.json({ tasks });
	} catch (err) {
		console.error("GET /api/tasks - Error:", err);
		return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
	}
}

export async function POST(req) {
	try {
		console.log("POST /api/tasks - Starting request");
		await connectToDB();
		console.log("POST /api/tasks - Connected to MongoDB");
		
		const token = req.cookies.get("token")?.value;
		console.log("POST /api/tasks - Token present:", !!token);
		
		const data = verifyToken(token);
		if (!data) {
			console.log("POST /api/tasks - Token verification failed");
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		console.log("POST /api/tasks - User ID:", data.id);

		const body = await req.json();
		console.log("POST /api/tasks - Request body:", body);
		
		if (!body.title || body.title.trim() === "") {
			return NextResponse.json({ error: "Task title is required" }, { status: 400 });
		}

		const task = new Task({
			title: body.title.trim(),
			description: body.description?.trim() || "",
			user: data.id
		});
		
		await task.save();
		console.log("POST /api/tasks - Task created:", task._id);
		
		return NextResponse.json({ task });
	} catch (err) {
		console.error("POST /api/tasks - Error:", err);
		return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
	}
}
