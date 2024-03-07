import { Controller } from "react-hook-form";
import { NestedForm } from "../../../../utils/nested-form";
import Switch from "../../../atoms/switch";

export type PersonalizeMessageFormType = {
	value: boolean;
};

type Props = {
	form: NestedForm<PersonalizeMessageFormType>;
};

const PersionalizeMessageForm = ({ form }: Props) => {
	const { control, path } = form;
	return (
		<div>
			<div className="mb-2xsmall flex items-center justify-between">
				<h2 className="inter-base-semibold">Personalised Messages</h2>
				<Controller
					control={control}
					name={path("value")}
					render={({ field: { value, onChange } }) => {
						return <Switch checked={value} onCheckedChange={onChange} />;
					}}
				/>
			</div>
			<p className="inter-base-regular text-grey-50">
				When unchecked the product can not have personalised messages.
			</p>
		</div>
	);
};

export default PersionalizeMessageForm;
