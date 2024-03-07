import { useAdminCustomPost } from "medusa-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../../../components/fundamentals/button";
import CrossIcon from "../../../components/fundamentals/icons/cross-icon";
import InputField from "../../../components/molecules/input";
import SideModal from "../../../components/molecules/modal/side-modal";
import useNotification from "../../../hooks/use-notification";
import { StoreLocation } from "../../../types/extensions";

type DetailsModalProps = {
	close: () => void;
	selectedStore?: StoreLocation;
};

type StoreFormValues = {
	name: string;
	code: string;
	address: {
		address_1: string;
		address_2: string;
		city: string;
		province: string;
		postal_code: string;
		country_code: string;
		phone: string;
	};
};

export default function DetailsModal(props: DetailsModalProps) {
	const { close, selectedStore } = props;

	const notification = useNotification();
	const { t } = useTranslation();

	const { mutateAsync: updateStore } = useAdminCustomPost(
		`store-locations/${selectedStore?.id}`,
		["store-locations", "list"]
	);

	const { register, handleSubmit, formState } = useForm<StoreFormValues>({
		defaultValues: mapFormValue(selectedStore as StoreLocation),
	});

	const onSave = async (data: any) => {
		try {
			await updateStore(data);
			close();
			notification(
				t("modals-success", "Success"),
				t("modals-updated-the-store", "Updated the store"),
				"success"
			);
		} catch (e) {
			notification(
				t("modals-error", "Error"),
				t("modals-failed-to-update-the-store", "Failed to update the store"),
				"error"
			);
		}
	};

	return (
		<SideModal close={close} isVisible={!!selectedStore}>
			<div className="flex h-full flex-col justify-between p-6">
				{/* === HEADER === */}

				<div className="flex items-center justify-between">
					<h3 className="inter-large-semibold text-xl text-gray-900">
						{t("modals-edit-api-key-details", "Edit API key details")}
					</h3>
					<Button variant="ghost" onClick={close}>
						<CrossIcon size={20} className="text-grey-40" />
					</Button>
				</div>
				{/* === DIVIDER === */}

				<div
					className="block h-[1px] bg-gray-200"
					style={{ margin: "24px -24px" }}
				/>
				{/* === BODY === */}

				<div className="flex-grow text-sm">
					<InputField
						label={t("modals-name", "Name")}
						type="string"
						placeholder={t("modals-name-your-key", "Name your key")}
						{...register("name", { required: true })}
					/>

					<InputField
						label="Code"
						type="string"
						{...register("code", { required: true })}
						placeholder="Store code"
					/>

					<div className="grid grid-cols-2 mt-5 gap-3 ">
						<h5 className="col-span-full inter-base-semibold text-grey-90 pb-1">
							Store Address
						</h5>

						<InputField
							label="Address 1"
							type="string"
							{...register("address.address_1", { required: true })}
							placeholder="Address 1"
						/>
						<InputField
							label="Address 2"
							type="string"
							{...register("address.address_2")}
							placeholder="Address 2"
						/>

						<InputField
							label="City"
							type="string"
							{...register("address.city", { required: true })}
							placeholder="City"
						/>
						{/* <InputField
							label="Country Code"
							type="string"
							{...register("address.country_code", { required: true })}
							placeholder="Country Code"
						/> */}
						<InputField
							label="State"
							type="string"
							{...register("address.province")}
							placeholder="State"
						/>
						<InputField
							label="Phone"
							type="string"
							{...register("address.phone")}
							placeholder="State"
						/>
					</div>
				</div>
				{/* === DIVIDER === */}

				<div
					className="block h-[1px] bg-gray-200"
					style={{ margin: "24px -24px" }}
				/>
				{/* === FOOTER === */}

				<div className="flex justify-end gap-2">
					<Button size="small" variant="ghost" onClick={close}>
						{t("modals-cancel", "Cancel")}
					</Button>
					<Button
						size="small"
						variant="primary"
						onClick={handleSubmit(onSave)}
						disabled={formState.isDirty === false}
					>
						{t("modals-save-and-close", "Save and close")}
					</Button>
				</div>
			</div>
		</SideModal>
	);
}

function mapFormValue(store: StoreLocation): StoreFormValues {
	return {
		name: store.name || "",
		code: store.code || "",
		address: {
			address_1: store.address.address_1 || "",
			address_2: store.address.address_2 || "",
			city: store.address.city || "",
			province: store.address.province || "",
			postal_code: store.address.postal_code || "",
			country_code: store.address.country_code || "gb",
			phone: store.address.phone || "",
		},
	};
}
