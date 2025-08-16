"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Sparkles } from "lucide-react";

export default function TaskForm({ onCreate }) {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		
		try {
			const res = await fetch("/api/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description: desc })
			});
			const data = await res.json();
			
			if (!res.ok) {
				throw new Error(data?.error || "Failed to create task");
			}
			
			setTitle("");
			setDesc("");
			if (onCreate) onCreate(data.task);
		} catch (err) {
			console.error("Create task error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className="border-0 shadow-lg bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
			<CardHeader className="pb-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
						<Sparkles className="w-5 h-5 text-primary" />
					</div>
					<div>
						<CardTitle className="text-lg">Create New Task</CardTitle>
						<CardDescription>
							Add a new task to your list
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="task-title" className="text-sm font-medium text-foreground">
							Task Title
						</label>
						<Input
							id="task-title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="What needs to be done?"
							required
							className="h-11"
						/>
					</div>
					
					<div className="space-y-2">
						<label htmlFor="task-description" className="text-sm font-medium text-foreground">
							Description (Optional)
						</label>
						<Textarea
							id="task-description"
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
							placeholder="Add more details about this task..."
							className="min-h-[80px] resize-none"
						/>
					</div>
					
					{error && (
						<div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
							{error}
						</div>
					)}
					
					<Button 
						type="submit" 
						disabled={loading || !title.trim()} 
						className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Task...
							</>
						) : (
							<>
								<Plus className="mr-2 h-4 w-4" />
								Add Task
							</>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

