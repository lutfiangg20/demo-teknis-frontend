import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// export const clienLoader = ({}: Route.LoaderArgs) => {
// 	return redirect("/login");
// };

export default function Home() {
	return <Welcome />;
}
