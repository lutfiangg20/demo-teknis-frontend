import api from "~/lib/axios";
import type { Route } from "./+types/page";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { Payload } from "~/types/payload";
import { redirect } from "react-router";
import FormSection from "./FormSection";

export type User = {
	id: number;
	name: string;
	phoneNumber: string;
	email: string;
	address: string;
	bio: string;
	dateOfBirth: string;
};

export const clientLoader = async () => {
	const token = Cookies.get("token");
	if (!token) {
		return redirect("/login");
	}
	const payload = jwtDecode<Payload>(token as string);
	const res = await api.get<{ data: User }>(`/users/${payload.userId}`);
	return { user: res.data.data };
};
const page = ({ loaderData }: Route.ComponentProps) => {
	const { user } = loaderData;
	return (
		<div className="w-full h-full space-y-10 grid grid-cols-12 gap-4">
			<div className="flex flex-col h-full items-center w-full col-span-2 border rounded-xl p-4 space-y-4">
				<img className="rounded-full bg-gray-200 w-20 h-20" />
				<div className="">
					<p>{user.name}</p>
					<p className="text-sm text-gray-500">{user.email}</p>
				</div>
			</div>
			<FormSection />
		</div>
	);
};

export default page;
