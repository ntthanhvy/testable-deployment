import { Controller } from "react-hook-form";
import InputField from "../../../../../components/molecules/input";
import TextArea from "../../../../../components/molecules/textarea";
import FormValidator from "../../../../../utils/form-validator";
import { NestedForm } from "../../../../../utils/nested-form";
import Switch from "../../../../atoms/switch";
import InputHeader from "../../../../fundamentals/input-header";

export type VariantCustomFieldsFormType = {
	size: string | null;
	shape: string | null;
	nutritic_code: string | null;
	meta_title: string | null;
	meta_description: string | null;
	character_limit: string | null;
	image_upload: boolean;
};

type Props = {
	form: NestedForm<VariantCustomFieldsFormType>;
};

export default function VariantCustomFieldsForm({ form }: Props) {
	const {
		path,
		register,
		formState: { errors },
		control,
	} = form;

	return (
		<div className="pt-large">
			<div className="grid grid-cols-2 gap-large">
				<InputField
					label="Product Size"
					placeholder='8"'
					{...register(path("size"), {})}
					errors={errors}
				/>
				<InputField
					label="Product Shape"
					placeholder="Square"
					{...form.register(path("shape"), {})}
					errors={errors}
				/>
				<InputField
					label="Nutritic Code"
					placeholder="Nutritic Code"
					{...form.register(path("nutritic_code"), {})}
					errors={errors}
				/>
				<InputField
					label="Meta Title"
					placeholder="Title"
					{...form.register(path("meta_title"), {
						pattern: FormValidator.whiteSpaceRule("Meta Title"),
					})}
					errors={errors}
				/>
				<div className="col-span-full">
					<TextArea
						label={"Meta Description"}
						placeholder="Description"
						{...form.register(path("meta_description"), {})}
						errors={errors}
						rows={4}
					/>
				</div>
				<InputField
					label="Character Limit"
					placeholder="Character Limit"
					{...form.register(path("character_limit"), {})}
				/>
				<div className="w-full">
					<InputHeader label="Image Upload" />

					<Controller
						control={control}
						name={path("image_upload")}
						render={({ field: { value, onChange } }) => {
							return <Switch checked={value} onCheckedChange={onChange} />;
						}}
					/>
				</div>
			</div>
		</div>
	);
}
