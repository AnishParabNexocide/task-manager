import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		await connectToDB();
		const body = await req.json();
		const { name, email, password } = body;
		if (!name || !email || !password) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}

		const existing = await User.findOne({ email });
		if (existing) {
			return NextResponse.json({ error: "Email already in use" }, { status: 409 });
		}

		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashed });

		const token = signToken({ id: user._id });
		const resp = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } });

		// set httpOnly cookie
		resp.cookies.set({
			name: "token",
			value: token,
			httpOnly: true,
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});
		return resp;
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
