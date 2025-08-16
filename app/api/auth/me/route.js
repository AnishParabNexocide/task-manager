import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		console.log("GET /api/auth/me - Starting request");
		await connectToDB();
		console.log("GET /api/auth/me - Connected to MongoDB");
		
		const token = req.cookies.get("token")?.value;
		console.log("GET /api/auth/me - Token present:", !!token);
		
		if (!token) {
			console.log("GET /api/auth/me - No token provided");
			return NextResponse.json({ user: null }, { status: 200 });
		}
		
		const data = verifyToken(token);
		if (!data) {
			console.log("GET /api/auth/me - Token verification failed");
			return NextResponse.json({ user: null }, { status: 200 });
		}
		console.log("GET /api/auth/me - Token verified, user ID:", data.id);

		const user = await User.findById(data.id).select("-password");
		if (!user) {
			console.log("GET /api/auth/me - User not found in database");
			return NextResponse.json({ user: null }, { status: 200 });
		}
		
		console.log("GET /api/auth/me - User found:", user.email);
		return NextResponse.json({ user });
	} catch (err) {
		console.error("GET /api/auth/me - Error:", err);
		return NextResponse.json({ user: null }, { status: 500 });
	}
}
