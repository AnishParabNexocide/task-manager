"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";

export default function AuthForm({ onSuccess }) {
	const [activeTab, setActiveTab] = useState("login");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Login state
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	// Register state
	const [registerName, setRegisterName] = useState("");
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");

	async function handleLogin(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: loginEmail, password: loginPassword })
			});
			const data = await res.json();
			
			if (!res.ok) throw new Error(data?.error || "Login failed");
			
			if (onSuccess) onSuccess();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	async function handleRegister(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					name: registerName, 
					email: registerEmail, 
					password: registerPassword 
				})
			});
			const data = await res.json();
			
			if (!res.ok) throw new Error(data?.error || "Registration failed");
			
			if (onSuccess) onSuccess();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			<TabsList className="grid w-full grid-cols-2 mb-6">
				<TabsTrigger value="login" className="flex items-center gap-2">
					<LogIn className="w-4 h-4" />
					Login
				</TabsTrigger>
				<TabsTrigger value="register" className="flex items-center gap-2">
					<UserPlus className="w-4 h-4" />
					Register
				</TabsTrigger>
			</TabsList>

			<TabsContent value="login" className="space-y-4">
				<form onSubmit={handleLogin} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="login-email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="login-email"
							type="email"
							placeholder="Enter your email"
							value={loginEmail}
							onChange={(e) => setLoginEmail(e.target.value)}
							required
							className="h-11"
						/>
					</div>
					
					<div className="space-y-2">
						<label htmlFor="login-password" className="text-sm font-medium">
							Password
						</label>
						<div className="relative">
							<Input
								id="login-password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={loginPassword}
								onChange={(e) => setLoginPassword(e.target.value)}
								required
								className="h-11 pr-10"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>

					{error && (
						<div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
							{error}
						</div>
					)}

					<Button type="submit" className="w-full h-11" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in...
							</>
						) : (
							<>
								<LogIn className="mr-2 h-4 w-4" />
								Sign In
							</>
						)}
					</Button>
				</form>
			</TabsContent>

			<TabsContent value="register" className="space-y-4">
				<form onSubmit={handleRegister} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="register-name" className="text-sm font-medium">
							Full Name
						</label>
						<Input
							id="register-name"
							type="text"
							placeholder="Enter your full name"
							value={registerName}
							onChange={(e) => setRegisterName(e.target.value)}
							required
							className="h-11"
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="register-email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="register-email"
							type="email"
							placeholder="Enter your email"
							value={registerEmail}
							onChange={(e) => setRegisterEmail(e.target.value)}
							required
							className="h-11"
						/>
					</div>
					
					<div className="space-y-2">
						<label htmlFor="register-password" className="text-sm font-medium">
							Password
						</label>
						<div className="relative">
							<Input
								id="register-password"
								type={showPassword ? "text" : "password"}
								placeholder="Create a password"
								value={registerPassword}
								onChange={(e) => setRegisterPassword(e.target.value)}
								required
								className="h-11 pr-10"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>

					{error && (
						<div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
							{error}
						</div>
					)}

					<Button type="submit" className="w-full h-11" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating account...
							</>
						) : (
							<>
								<UserPlus className="mr-2 h-4 w-4" />
								Create Account
							</>
						)}
					</Button>
				</form>
			</TabsContent>
		</Tabs>
	);
}

