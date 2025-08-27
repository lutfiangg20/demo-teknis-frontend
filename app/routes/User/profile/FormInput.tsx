import type { HTMLInputTypeAttribute } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

type Props = {
	onChange: (value: string) => void;
	data: string;
	name: string;
	type?: HTMLInputTypeAttribute | undefined;
	isEdit: boolean;
};

const FormInput = ({ onChange, data, name, type, isEdit }: Props) => {
	return (
		<div className="grid grid-cols-12">
			<Label className="col-span-6">{name}</Label>
			{!isEdit && <div className="col-span-6">{data}</div>}
			{(name == "Bio" || name == "Address") && isEdit ? (
				<Textarea
					defaultValue={data}
					onChange={(e) => onChange(e.target.value)}
					className=" col-span-6"
				/>
			) : (
				<Input
					onChange={(e) => onChange(e.target.value)}
					className="col-span-6"
					type={type}
					defaultValue={data}
				/>
			)}
		</div>
	);
};

export default FormInput;
