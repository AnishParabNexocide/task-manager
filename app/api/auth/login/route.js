import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		await connectToDB();
		const { email, password } = await req.json();
		if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

		const user = await User.findOne({ email });
		if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

		const token = signToken({ id: user._id });
		const resp = NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } });
		resp.cookies.set({
			name: "token",
			value: token,
			httpOnly: true,
			path: "/",
			maxAge: 60 * 60 * 24 * 7,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production"
		});
		return resp;
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
