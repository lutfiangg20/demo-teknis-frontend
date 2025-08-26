import { useState, type FormEvent } from "react";
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
import api from "~/lib/axios";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";

export function HydrateFallback() {
	return <p>Loading Game...</p>;
}

const page = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isOpen, setIsOpen] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const res = await api.post<{
				data: { accessToken: string; expiredAt: number };
			}>("/auth/login", formData);
			console.log("res", res.data);
			Cookies.set("token", res.data.data.accessToken, {
				expires: 7,
			});
			return navigate("/user/profile");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="flex w-full justify-center h-screen items-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<form className="space-y-10" onSubmit={handleSubmit}>
					<CardContent>
						<div className="flex flex-col gap-6">
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
							Login
						</Button>
						<Link to="/signup" className="w-full">
							<Button
								type="button"
								className="w-full text-primary"
								variant={"outline"}
							>
								Sign Up
							</Button>
						</Link>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
};

export default page;
