"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "./ThemeToggle";
import { 
	LogOut, 
	User, 
	Settings, 
	Home, 
	CheckSquare, 
	Menu,
	X
} from "lucide-react";

export default function Navbar({ onLogout }) {
	const [user, setUser] = useState(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		fetch("/api/auth/me")
			.then(r => r.json())
			.then(data => setUser(data.user || null))
			.catch(() => setUser(null));
	}, []);

	async function handleLogout() {
		await fetch("/api/auth/logout", { method: "POST" });
		setUser(null);
		if (onLogout) onLogout();
		window.location.href = "/";
	}

	function getInitials(name) {
		return name
			.split(' ')
			.map(word => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	return (
		<nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			<div className="max-w-6xl mx-auto px-6">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<CheckSquare className="w-5 h-5 text-primary-foreground" />
						</div>
						<div className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
							Task
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-6">
						{user && (
							<>
								<a 
									href="/" 
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									<Home className="w-4 h-4" />
									Home
								</a>
								<a 
									href="/dashboard" 
									className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									<CheckSquare className="w-4 h-4" />
									Dashboard
								</a>
							</>
						)}
					</div>

					{/* User Menu & Actions */}
					<div className="flex items-center gap-4">
						{/* Theme Toggle */}
						<ThemeToggle />
						
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="relative h-10 w-10 rounded-full">
										<Avatar className="h-10 w-10">
											<AvatarImage src={user.avatarUrl} alt={user.name} />
											<AvatarFallback className="bg-primary text-primary-foreground">
												{getInitials(user.name)}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">{user.name}</p>
											<p className="text-xs leading-none text-muted-foreground">{user.email}</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<a href="/dashboard" className="cursor-pointer">
											<CheckSquare className="mr-2 h-4 w-4" />
											<span>Dashboard</span>
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<a href="/" className="cursor-pointer">
											<Home className="mr-2 h-4 w-4" />
											<span>Home</span>
										</a>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
										<LogOut className="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<div className="flex items-center gap-3">
								<a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									Sign In
								</a>
								<Button asChild size="sm">
									<a href="/">Get Started</a>
								</Button>
							</div>
						)}

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="sm"
							className="md:hidden"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t">
						{user && (
							<div className="space-y-3">
								<a 
									href="/" 
									className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									<Home className="w-4 h-4" />
									Home
								</a>
								<a 
									href="/dashboard" 
									className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									<CheckSquare className="w-4 h-4" />
									Dashboard
								</a>
								<Separator />
								<button 
									onClick={() => {
										handleLogout();
										setMobileMenuOpen(false);
									}}
									className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors w-full text-left"
								>
									<LogOut className="w-4 h-4" />
									Log out
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</nav>
	);
}

