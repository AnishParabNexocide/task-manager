"use client";
import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskList() {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/tasks");
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to load tasks");
			setTasks(data.tasks || []);
		} catch (err) {
			console.error("Load tasks error:", err);
			setError(err.message);
		} finally { 
			setLoading(false); 
		}
	}

	useEffect(() => { load() }, []);

	function onAdded(task) { 
		setTasks(prev => [task, ...prev]); 
		setError(null);
	}
	
	function onUpdated(task) { 
		setTasks(prev => prev.map(t => t._id === task._id ? task : t)); 
		setError(null);
	}
	
	function onDeleted(id) { 
		setTasks(prev => prev.filter(t => t._id !== id)); 
		setError(null);
	}

	const completedTasks = tasks.filter(t => t.completed);
	const pendingTasks = tasks.filter(t => !t.completed);

	return (
		<div className="space-y-6">
			{/* Task Form */}
			<TaskForm onCreate={onAdded} />
			
			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="border-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
								<ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Tasks</p>
								<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
								<Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Pending</p>
								<p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingTasks.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-0 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
								<CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Completed</p>
								<p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tasks Section */}
			<Card className="border-0 shadow-lg">
				<CardHeader className="pb-4">
					<CardTitle className="text-xl flex items-center gap-2">
						<ListTodo className="w-5 h-5" />
						Your Tasks
					</CardTitle>
					<CardDescription>
						Manage and organize your daily tasks
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Error Display */}
					{error && (
						<div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20">
							<div className="flex items-center justify-between">
								<div className="text-destructive text-sm">
									<strong>Error:</strong> {error}
								</div>
								<Button 
									variant="outline" 
									size="sm" 
									onClick={load}
									className="text-destructive border-destructive/20 hover:bg-destructive/10"
								>
									Retry
								</Button>
							</div>
						</div>
					)}
					
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Loader2 className="w-5 h-5 animate-spin" />
								Loading tasks...
							</div>
						</div>
					) : tasks.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
								<ListTodo className="w-8 h-8 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-medium text-muted-foreground mb-2">No tasks yet</h3>
							<p className="text-sm text-muted-foreground">Create your first task to get started!</p>
						</div>
					) : (
						<div className="space-y-4">
							{/* Pending Tasks */}
							{pendingTasks.length > 0 && (
								<div>
									<div className="flex items-center gap-2 mb-3">
										<Badge variant="secondary" className="text-xs">
											<Clock className="w-3 h-3 mr-1" />
											Pending ({pendingTasks.length})
										</Badge>
									</div>
									<div className="space-y-3">
										{pendingTasks.map(task => (
											<TaskItem 
												key={task._id} 
												task={task} 
												onUpdated={onUpdated} 
												onDeleted={onDeleted} 
											/>
										))}
									</div>
								</div>
							)}

							{/* Separator between sections */}
							{completedTasks.length > 0 && pendingTasks.length > 0 && (
								<Separator className="my-6" />
							)}

							{/* Completed Tasks */}
							{completedTasks.length > 0 && (
								<div>
									<div className="flex items-center gap-2 mb-3">
										<Badge variant="outline" className="text-xs">
											<CheckCircle2 className="w-3 h-3 mr-1" />
											Completed ({completedTasks.length})
										</Badge>
									</div>
									<div className="space-y-3">
										{completedTasks.map(task => (
											<TaskItem 
												key={task._id} 
												task={task} 
												onUpdated={onUpdated} 
												onDeleted={onDeleted} 
											/>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

