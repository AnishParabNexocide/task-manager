"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
	Edit3, 
	Trash2, 
	Save, 
	X, 
	CheckCircle2, 
	Circle, 
	Calendar,
	Loader2
} from "lucide-react";

export default function TaskItem({ task, onUpdated, onDeleted }) {
	const [editing, setEditing] = useState(false);
	const [title, setTitle] = useState(task.title);
	const [desc, setDesc] = useState(task.description || "");
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState(null);

	async function toggleComplete() {
		try {
			const res = await fetch(`/api/tasks/${task._id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ completed: !task.completed })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to update task");
			onUpdated(data.task);
		} catch (err) { 
			console.error("Toggle complete error:", err);
			setError(err.message);
			setTimeout(() => setError(null), 5000);
		}
	}

	async function save() {
		if (!title.trim()) return;
		
		setSaving(true);
		try {
			const res = await fetch(`/api/tasks/${task._id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: title.trim(), description: desc.trim() })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to save task");
			onUpdated(data.task);
			setEditing(false);
			setError(null);
		} catch (err) { 
			console.error("Save error:", err);
			setError(err.message);
			setTimeout(() => setError(null), 5000);
		}
		setSaving(false);
	}

	async function remove() {
		if (!confirm("Are you sure you want to delete this task?")) {
			return;
		}
		
		setDeleting(true);
		try {
			const res = await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
			const data = await res.json();
			
			if (!res.ok) {
				throw new Error(data?.error || "Failed to delete task");
			}
			
			// Check if deletion was successful
			if (data.success) {
				onDeleted(task._id);
			} else {
				throw new Error("Task deletion failed");
			}
		} catch (err) { 
			console.error("Delete error:", err);
			// Show error in the UI instead of alert
			setError(err.message);
			// Clear error after 5 seconds
			setTimeout(() => setError(null), 5000);
		} finally {
			setDeleting(false);
		}
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	return (
		<Card className={`transition-all duration-200 hover:shadow-md ${
			task.completed ? 'bg-muted/30 border-muted' : 'bg-card'
		}`}>
			<CardContent className="p-4">
				{/* Error Display */}
				{error && (
					<div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
						{error}
					</div>
				)}
				
				{!editing ? (
					<div className="flex items-start gap-4">
						{/* Checkbox */}
						<Checkbox
							checked={task.completed}
							onCheckedChange={toggleComplete}
							className="mt-1"
						/>
						
						{/* Task Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2 mb-2">
								<h3 className={`font-medium text-base leading-tight ${
									task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
								}`}>
									{task.title}
								</h3>
								<div className="flex items-center gap-1">
									{task.completed && (
										<Badge variant="secondary" className="text-xs">
											<CheckCircle2 className="w-3 h-3 mr-1" />
											Completed
										</Badge>
									)}
									<Badge variant="outline" className="text-xs">
										<Calendar className="w-3 h-3 mr-1" />
										{formatDate(task.createdAt)}
									</Badge>
								</div>
							</div>
							
							{task.description && (
								<p className={`text-sm leading-relaxed ${
									task.completed ? 'text-muted-foreground' : 'text-muted-foreground'
								}`}>
									{task.description}
								</p>
							)}
						</div>
						
						{/* Action Buttons */}
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setEditing(true)}
								className="h-8 w-8 p-0 hover:bg-muted"
							>
								<Edit3 className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={remove}
								disabled={deleting}
								className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
							>
								{deleting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Trash2 className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Task Title</label>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Task title"
								className="h-9"
							/>
						</div>
						
						<div className="space-y-2">
							<label className="text-sm font-medium">Description</label>
							<Textarea
								value={desc}
								onChange={(e) => setDesc(e.target.value)}
								placeholder="Task description (optional)"
								className="min-h-[60px] resize-none"
							/>
						</div>
						
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								onClick={save}
								disabled={saving || !title.trim()}
								className="h-9"
							>
								{saving ? (
									<>
										<Loader2 className="mr-2 h-3 w-3 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-3 w-3" />
										Save
									</>
								)}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setEditing(false);
									setTitle(task.title);
									setDesc(task.description || "");
									setError(null);
								}}
								className="h-9"
							>
								<X className="mr-2 h-3 w-3" />
								Cancel
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

