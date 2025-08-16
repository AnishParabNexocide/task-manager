// /app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
	const resp = NextResponse.json({ ok: true });
	resp.cookies.set({
		name: "token",
		value: "",
		path: "/",
		maxAge: 0,
	});
	return resp;
}

