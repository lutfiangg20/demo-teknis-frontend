import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Link, redirect, useNavigate } from "react-router";
import api from "~/lib/axios";
import type { AxiosError } from "axios";

const page = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("formdata", formData);
		try {
			const res = await api.post("/users", formData);
			console.log("res", res.data);
			navigate("/login");
		} catch (error) {
			const err = error as AxiosError;
			console.error(err.response);
		}
	};
	return (
		<div className="flex w-full justify-center h-screen items-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>
						Create a new account to access all features. Sign up now and enjoy a
						more personalized experience.
					</CardDescription>
					<CardAction>
						<Button variant={"link"}>
							<Link to="/login">Back</Link>
						</Button>
					</CardAction>
				</CardHeader>
				<form className="space-y-10" onSubmit={handleSubmit}>
					<CardContent>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="text"
									required
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Forgot your password?
									</a>
								</div>
								<div className="relative">
									<Input
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										id="password"
										type={isOpen ? "text" : "password"}
										required
									/>
									{isOpen ? (
										<Eye
											onClick={() => setIsOpen(!isOpen)}
											className="absolute top-2 right-2"
										/>
									) : (
										<EyeClosed
											onClick={() => setIsOpen(!isOpen)}
											className="absolute top-2 right-2"
										/>
									)}
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button type="submit" className="w-full">
							Sign Up
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default page;
