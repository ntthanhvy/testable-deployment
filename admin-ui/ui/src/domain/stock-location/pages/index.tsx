import { useAdminCustomPost } from "medusa-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Fade from "../../../components/atoms/fade-wrapper";
import Spacer from "../../../components/atoms/spacer";
import Button from "../../../components/fundamentals/button";
import CrossIcon from "../../../components/fundamentals/icons/cross-icon";
import InputField from "../../../components/molecules/input";
import FocusModal from "../../../components/molecules/modal/focus-modal";
import { NextSelect } from "../../../components/molecules/select/next-select";
import BodyCard from "../../../components/organisms/body-card";
import useNotification from "../../../hooks/use-notification";
import useToggleState from "../../../hooks/use-toggle-state";
import { StoreLocation } from "../../../types/extensions";
import { Option } from "../../../types/shared";
import { useStoreData } from "../../settings/regions/components/region-form/use-store-data";
import StoreLocationTable from "../table";

type StoreFormValues = {
	name: string;
	code: string;
	email: string;
	address: {
		address_1: string;
		address_2: string;
		city: string;
		province: string;
		postal_code: string;
		country_code: Option;
		phone: string;
		first_name: string;
		last_name: string;
		metadata: any;
		company: string;
	};
};

function CreateStoreLocation(props: {
	closeModal: () => void;
	selectedStore?: StoreLocation;
}) {
	const { closeModal, selectedStore } = props;
	const notification = useNotification();

	const { countryOptions } = useStoreData();
	const { t } = useTranslation();

	const { mutateAsync: createStoreLocation } = useAdminCustomPost(
		"/store-locations",
		["store-locations", "list"]
	);

	const { mutateAsync: updateStore } = useAdminCustomPost(
		`store-locations/${selectedStore?.id}`,
		["store-locations", "list"]
	);

	const { register, handleSubmit, formState, control, setValue } =
		useForm<StoreFormValues>({
			defaultValues: mapFormValue(selectedStore, countryOptions),
		});

	// useEffect(() => {
	// 	if (countryOptions && countryOptions.length > 0) {
	// 		const country = countryOptions.find(
	// 			(c) => c.value === selectedStore?.address?.country_code
	// 		);
	// 	}
	// }, [countryOptions]);

	const onSubmit = async (data: any) => {
		try {
			if (selectedStore) {
				await updateStore({
					...data,
					address: {
						...data.address,
						country_code: data.address.country_code?.value,
					},
				});
				notification(
					t("pages-success", "Success"),
					t("pages-updated-the-store-location", "Updated the store location"),
					"success"
				);
			} else {
				const res = await createStoreLocation({
					...data,
					address: {
						...data.address,
						country_code: data.address.country_code?.value,
					},
				});
				notification(
					t("pages-success", "Success"),
					t(
						"pages-created-a-new-store-location",
						"Created a new store location"
					),
					"success"
				);
			}
			closeModal();
		} catch (e) {
			console.log(e);
			notification(
				t("pages-error", "Error"),
				t(
					"pages-failed-to-create-new-store-location",
					"Failed to create new store locaton"
				),
				"error"
			);
		}
	};

	const { errors } = formState;

	return (
		<FocusModal>
			<FocusModal.Header>
				<div className="medium:w-8/12 flex w-full justify-between px-8">
					<Button size="small" variant="ghost" onClick={closeModal}>
						<CrossIcon size={20} />
					</Button>
					<div className="gap-x-small flex">
						<Button
							size="small"
							variant="primary"
							onClick={handleSubmit(onSubmit)}
							disabled={formState.isDirty === false}
							className="rounded-rounded"
						>
							{t("pages-store-location", "Save and close")}
						</Button>
					</div>
				</div>
			</FocusModal.Header>

			<FocusModal.Main className="no-scrollbar flex w-full justify-center">
				<div className="medium:w-7/12 large:w-6/12 small:w-4/5 my-16 max-w-[700px]">
					<h1 className="inter-xlarge-semibold text-grey-90 pb-8">
						{t("pages-create-store-location", "Create Store Location")}
					</h1>

					<div className="grid grid-cols-2 gap-3">
						<InputField
							label="Name"
							type="string"
							{...register("name", { required: true })}
							className="w-[338px]"
							placeholder="Name your store"
						/>
						<InputField
							label="Code"
							type="string"
							{...register("code", { required: true })}
							className="w-[338px]"
							placeholder="Store code"
						/>
						<InputField
							label="Email"
							type="string"
							{...register("email", { required: true })}
							className="w-[338px]"
							placeholder="Store email"
						/>
					</div>

					<div className="grid grid-cols-2 mt-5 gap-3 ">
						<h5 className="col-span-full inter-base-semibold text-grey-90 pb-1">
							Store Address
						</h5>

						<InputField
							label="Address 1"
							type="string"
							{...register("address.address_1", { required: true })}
							className="w-[338px]"
							placeholder="Address 1"
						/>
						<InputField
							label="Address 2"
							type="string"
							{...register("address.address_2")}
							className="w-[338px]"
							placeholder="Address 2"
						/>

						<InputField
							label="City"
							type="string"
							{...register("address.city", { required: true })}
							className="w-[338px]"
							placeholder="City"
						/>
						<Controller
							control={control}
							name={"address.country_code"}
							render={({ field }) => {
								return (
									<NextSelect
										label={t("store-form-countries", "Country")}
										placeholder={t(
											"store-form-choose-countries",
											"Choose country"
										)}
										{...field}
										errors={errors}
										options={countryOptions}
									/>
								);
							}}
						/>

						<InputField
							label="State"
							type="string"
							{...register("address.province")}
							className="w-[338px]"
							placeholder="State"
						/>

						<InputField
							label="Postal Code"
							type="string"
							{...register("address.postal_code")}
							className="w-[338px]"
							placeholder="Postal Code"
						/>

						<InputField
							label="Phone"
							type="string"
							{...register("address.phone")}
							className="w-[338px]"
							placeholder="State"
						/>
					</div>
				</div>
			</FocusModal.Main>
		</FocusModal>
	);
}

export default function Index() {
	const { t } = useTranslation();

	const [isCreateModalVisible, openCreateModal, closeCreateModal] =
		useToggleState(false);

	const actions = [
		{
			label: t("pages-create-store-location-label", "Create Store Location"),
			onClick: openCreateModal,
		},
	];

	const [storeLocation, setStoreLocation] = useState<undefined | StoreLocation>(
		undefined
	);

	return (
		<div>
			<BodyCard
				title={t("pages-store-location", "Stores Locations")}
				actionables={actions}
			>
				<StoreLocationTable
					showDetailsModal={setStoreLocation}
					// showChannelsModal={_openChannelsModal}
				/>
				<Fade isVisible={isCreateModalVisible || !!storeLocation} isFullScreen>
					<CreateStoreLocation
						closeModal={() => {
							closeCreateModal();
							if (storeLocation) setStoreLocation(undefined);
						}}
						selectedStore={storeLocation}
					/>
				</Fade>
			</BodyCard>
			<Spacer />
		</div>
	);
}

function mapFormValue(
	store?: StoreLocation,
	countries?: Option[]
): StoreFormValues {
	return {
		name: store?.name || "",
		code: store?.code || "",
		email: store?.email || "",
		address: {
			address_1: store?.address?.address_1 || "",
			address_2: store?.address?.address_2 || "",
			city: store?.address?.city || "",
			province: store?.address?.province || "",
			postal_code: store?.address?.postal_code || "",
			country_code: store?.address?.country_code
				? {
						value: store?.address?.country_code,
						label:
							countries?.find((c) => c.value === store?.address?.country_code)
								?.label || "",
				  }
				: {
						value: "gb",
						label: "United Kingdom",
				  },
			phone: store?.address?.phone || "",
			first_name: "",
			last_name: "",
			metadata: {},
			company: "",
		},
	};
}
