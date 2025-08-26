import { Outlet, useNavigate, useNavigation } from "react-router";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import AppSidebar from "./AppSidebar";
import { useEffect } from "react";
import api from "~/lib/axios";
import { jwtDecode } from "jwt-decode";
import type { Payload } from "~/types/payload";
import Cookies from "js-cookie";
import type { User } from "~/routes/User/profile/page";

export const clientLoader = async () => {
	const token = Cookies.get("token");
	const payload = jwtDecode<Payload>(token as string);
	const res = await api.get<{ data: User }>(`/users/${payload.userId}`);
	return { user: res.data.data };
};

const MainLayout = () => {
	const navigation = useNavigation();
	const navigate = useNavigate();
	useEffect(() => {
		const checkToken = async () => {
			try {
				await api.get("/auth/check");
			} catch (error) {
				return navigate("/login");
			}
		};
		checkToken();
	}, [navigation.location]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="p-4 w-full flex flex-col">
				<SidebarTrigger />
				<div className="p-4 border w-full flex-1 rounded">
					<Outlet />
				</div>
			</main>
		</SidebarProvider>
	);
};

export default MainLayout;
