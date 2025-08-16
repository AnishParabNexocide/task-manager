import connectToDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		console.log("Health check - Starting");
		
		// Test MongoDB connection
		await connectToDB();
		console.log("Health check - MongoDB connected");
		
		// Test basic operations
		const mongoose = await import("mongoose");
		const admin = mongoose.default.connection.db.admin();
		const result = await admin.ping();
		
		console.log("Health check - MongoDB ping successful");
		
		return NextResponse.json({
			status: "healthy",
			timestamp: new Date().toISOString(),
			database: "connected",
			ping: result.ok === 1 ? "successful" : "failed"
		});
	} catch (error) {
		console.error("Health check - Error:", error);
		return NextResponse.json({
			status: "unhealthy",
			timestamp: new Date().toISOString(),
			error: error.message,
			database: "disconnected"
		}, { status: 500 });
	}
}

