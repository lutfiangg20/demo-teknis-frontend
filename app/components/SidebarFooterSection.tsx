import { ChevronUp, User2 } from "lucide-react";
import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import api from "~/lib/axios";
import type { AxiosError } from "axios";
import { useLoaderData, useNavigate } from "react-router";
import type { clientLoader } from "./MainLayout";
import Cookies from "js-cookie";

const SidebarFooterSection = () => {
	const navigate = useNavigate();
	const { user } = useLoaderData<typeof clientLoader>();
	const handleLogout = async () => {
		try {
			await api.get("/auth/logout");
			Cookies.remove("token");
			return navigate("/login");
		} catch (error) {
			const err = error as AxiosError;
			console.error(err.response);
		}
	};
	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<User2 /> {user.name}
								<ChevronUp className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							side="top"
							className="w-[--radix-popper-anchor-width]"
						>
							<DropdownMenuItem>
								<span>{user.name}</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<span>Billing</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogout}>
								<span>Sign out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
};

export default SidebarFooterSection;
