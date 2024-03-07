import { useAdminUpdateVariant } from "medusa-react";
import { useForm } from "react-hook-form";

import { ProductVariant } from "@medusajs/medusa";

import {
	Button,
	FocusModal,
	Heading,
	Input,
	Label,
	Textarea,
} from "@medusajs/ui";
import { useRef, useState } from "react";

type VariantCustomForm = {
	size: string;
	shape: string;
	nutritic_code: string;
	meta_title: string;
	meta_description: string;
};

export const VariantCustomModal = ({ productId, variant, open, onClose }) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const adminUpdateVariant = useAdminUpdateVariant(productId);

	const form = useForm<VariantCustomForm>({
		defaultValues: getDefaultValues(variant),
	});

	const {
		formState: { isDirty },
		handleSubmit,
		reset,
		register,
	} = form;

	const onReset = () => {
		reset(getDefaultValues(variant));
		onClose();
	};

	const btnRef = useRef<HTMLButtonElement>(null);
	const onSubmit = handleSubmit(async (values) => {
		console.log(values);

		setIsUpdating(true);

		try {
			await adminUpdateVariant.mutateAsync({
				variant_id: variant.id,
				...values,
			});
			onClose();
		} catch (err) {
			console.log(err);
		}

		setIsUpdating(false);
	});

	return (
		<FocusModal open={open} onOpenChange={onReset} modal>
			<FocusModal.Content>
				<FocusModal.Header>
					<Button
						variant="primary"
						type="button"
						disabled={!isDirty}
						isLoading={isUpdating}
						form="variant-custom-form"
						onClick={() => btnRef.current?.click()}
					>
						Save and close
					</Button>
				</FocusModal.Header>

				<FocusModal.Body className="flex flex-col items-center py-16">
					<form
						id="variant-customer-form"
						onSubmit={onSubmit}
						className="w-full"
					>
						<button className="hidden" type="submit" ref={btnRef}></button>
						<div className="w-full max-w-2xl mx-auto grid grid-cols-1 medium:grid-cols-2 gap-8">
							<div className="flex flex-col gap-y-1 col-span-full">
								<Heading>Custom Fields</Heading>
								{/* <Text className="text-ui-fg-subtle">
                  Create and manage API keys. You can create multiple keys to
                  organize your applications.
                </Text> */}
							</div>
							<div className="flex flex-col gap-y-2">
								<Label htmlFor="size" className="text-ui-fg-subtle">
									Size
								</Label>
								<Input id="size" placeholder="3xl" {...register("size")} />
							</div>
							<div className="flex flex-col gap-y-2">
								<Label htmlFor="shape" className="text-ui-fg-subtle">
									Shape
								</Label>
								<Input id="shape" placeholder="Shape" {...register("shape")} />
							</div>
							<div className="flex flex-col gap-y-2">
								<Label htmlFor="nutritic_code" className="text-ui-fg-subtle">
									Nutritic Code
								</Label>
								<Input
									id="nutritic_code"
									placeholder="Nutritic Code"
									{...register("nutritic_code", {})}
								/>
							</div>
							<div className="flex flex-col gap-y-2">
								<Label htmlFor="meta_title" className="text-ui-fg-subtle">
									Meta title
								</Label>
								<Input
									id="meta_title"
									placeholder="Meta title"
									{...register("meta_title", {})}
								/>
							</div>
							<div className="flex flex-col gap-y-2 col-span-full">
								<Label htmlFor="meta_description" className="text-ui-fg-subtle">
									Meta Description
								</Label>
								<Textarea
									id="meta_description"
									placeholder="Description..."
									{...register("meta_description", {})}
								/>
							</div>
						</div>
					</form>
				</FocusModal.Body>
			</FocusModal.Content>
		</FocusModal>
	);
};

function getDefaultValues(
	variant:
		| (ProductVariant & {
				meta_title: string | null;
				meta_description: string | null;
				size: string | null;
				shape: string | null;
				nutritic_code: string | null;
		  })
		| null
) {
	return {
		size: variant?.size ?? "",
		shape: variant?.shape ?? "",
		nutritic_code: variant?.nutritic_code ?? "",
		meta_title: variant?.meta_title ?? "",
		meta_description: variant?.meta_description ?? "",
	};
}
