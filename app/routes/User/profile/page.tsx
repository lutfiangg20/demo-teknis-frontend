import api from "~/lib/axios";
import type { Route } from "./+types/page";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { Payload } from "~/types/payload";
import { redirect } from "react-router";

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
	return <div>{user.name}</div>;
};

export default page;
