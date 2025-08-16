"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Calendar, Target } from "lucide-react";

export default function Dashboard() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/auth/me")
			.then(r => r.json())
			.then(data => {
				if (!data.user) {
					window.location.href = "/";
				} else {
					setUser(data.user);
				}
			})
			.catch(err => {
				console.error(err);
				window.location.href = "/";
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
				<Navbar />
				<main className="max-w-6xl mx-auto px-6 py-16">
					<div className="flex items-center justify-center py-12">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Loader2 className="w-6 h-6 animate-spin" />
							Loading dashboard...
						</div>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
			<Navbar />
			<main className="max-w-6xl mx-auto px-6 py-8">
				{/* Welcome Header */}
				<div className="mb-8">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
							<User className="w-8 h-8 text-primary" />
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Welcome back, {user?.name}!
							</h1>
						</div>
					</div>

					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							{new Date().toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</div>
					</div>
				</div>

				{/* User Info Card */}
				<Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg flex items-center gap-2">
							<User className="w-5 h-5" />
							Account Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground mb-1">Full Name</p>
								<p className="font-medium">{user?.name}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground mb-1">Email Address</p>
								<p className="font-medium">{user?.email}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Task Management Section */}
				<TaskList />
			</main>
		</div>
	);
}

