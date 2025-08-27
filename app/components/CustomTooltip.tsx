import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
	children: React.ReactNode;
	title: string;
};
const CustomTooltip = ({ children, title }: Props) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent>
				<p>{title}</p>
			</TooltipContent>
		</Tooltip>
	);
};

export default CustomTooltip;
