import { Store } from "@medusajs/medusa";
import { Button } from "@medusajs/ui";
import { useAdminStore, useAdminUpdateStore } from "medusa-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BackButton from "../../components/atoms/back-button";
import FileUploadField from "../../components/atoms/file-upload-field";
import EditIcon from "../../components/fundamentals/icons/edit-icon";
import TrashIcon from "../../components/fundamentals/icons/trash-icon";
import Input from "../../components/molecules/input";
import BodyCard from "../../components/organisms/body-card";
import useNotification from "../../hooks/use-notification";
import { FormImage } from "../../types/shared";
import { getErrorMessage } from "../../utils/error-messages";
import { prepareImages } from "../../utils/images";

type AccountDetailsFormData = {
	name: string;
	swap_link_template: string | null;
	payment_link_template: string | null;
	invite_link_template: string | null;
	banner_image: FormImage;
	logo: FormImage;
	favicon: FormImage;
	site_name: string | null;
};

const AccountDetails = () => {
	const { register, reset, handleSubmit, control, setValue } =
		useForm<AccountDetailsFormData>();
	const { store } = useAdminStore();
	const { mutate } = useAdminUpdateStore();
	const notification = useNotification();
	const { t } = useTranslation();

	const handleCancel = () => {
		if (store) {
			reset(mapStoreDetails(store));
		}
	};

	useEffect(() => {
		handleCancel();
	}, [store]);

	const onSubmit = async ({
		banner_image,
		favicon,
		logo,
		site_name,
		...data
	}: AccountDetailsFormData) => {
		let validateData: { [key: string]: any } = { ...data };

		const validateSwapLinkTemplate = validateUrl(
			data.swap_link_template || undefined
		);
		const validatePaymentLinkTemplate = validateUrl(
			data.payment_link_template || undefined
		);
		const validateInviteLinkTemplate = validateUrl(
			data.invite_link_template || undefined
		);

		if (!validateSwapLinkTemplate) {
			notification(
				t("settings-error", "Error"),
				t("settings-malformed-swap-url", "Malformed swap url"),
				"error"
			);
			return;
		}

		if (!validatePaymentLinkTemplate) {
			notification(
				t("settings-error", "Error"),
				t("settings-malformed-payment-url", "Malformed payment url"),
				"error"
			);
			return;
		}

		if (banner_image.nativeFile) {
			const banner = await prepareImages([banner_image]);
			validateData.banner_image = banner[0].url;
		}

		if (favicon.nativeFile) {
			const icon = await prepareImages([favicon]);
			validateData.favicon = icon[0].url;
		}

		if (site_name) {
			validateData.site_name = site_name;
		}

		if (logo.nativeFile) {
			const logoImage = await prepareImages([logo]);
			validateData.logo = logoImage[0].url;
		}

		if (!validateInviteLinkTemplate) {
			notification(
				t("settings-error", "Error"),
				t("settings-malformed-invite-url", "Malformed invite url"),
				"error"
			);
			return;
		}

		mutate(validateData, {
			onSuccess: () => {
				notification(
					t("settings-success", "Success"),
					t(
						"settings-successfully-updated-store",
						"Successfully updated store"
					),
					"success"
				);
			},
			onError: (error) => {
				notification(
					t("settings-error", "Error"),
					getErrorMessage(error),
					"error"
				);
			},
		});
	};

	const handleImage =
		(name: "banner_image" | "favicon" | "logo") => (files: File[]) => {
			if (!files.length) return;
			const image = {
				url: URL.createObjectURL(files[0]),
				name: files[0].name,
				size: files[0].size,
				nativeFile: files[0],
			};

			setValue(name, image);
		};

	return (
		<form className="flex-col py-5">
			<div className="max-w-[632px]">
				<BackButton
					path="/a/settings/"
					label={t("settings-back-to-settings", "Back to settings")}
					className="mb-xsmall"
				/>
				<BodyCard
					events={[
						{
							label: t("settings-save", "Save"),
							type: "button",
							onClick: handleSubmit(onSubmit),
						},
						{
							label: t("settings-cancel", "Cancel"),
							type: "button",
							onClick: handleCancel,
						},
					]}
					title={t("settings-store-details", "Store Details")}
					subtitle={t(
						"settings-manage-your-business-details",
						"Manage your business details"
					)}
				>
					<div className="gap-y-xlarge mb-large flex flex-col">
						<div>
							<h2 className="inter-base-semibold mb-base">
								{t("settings-general", "General")}
							</h2>
							<Input
								label={t("settings-store-name", "Store name")}
								{...register("name")}
								placeholder={t("settings-medusa-store", "Medusa Store")}
							/>
							<Input
								label={t("settings-site-name", "Site name")}
								{...register("site_name")}
								placeholder={t("settings-medusa-store", "Site name")}
							/>

							{/* logo */}
							<div className="mt-base flex w-full items-center">
								<Controller
									name="logo"
									control={control}
									render={({ field: { value } }) => (
										<>
											<label className="mb-xsmall text-sm text-gray-600">
												Logo
											</label>
											{value && value.url ? (
												<div className="relative ml-auto aspect-square w-[100px]">
													<div className="flex h-full w-full items-center justify-center">
														<img
															src={value.url}
															alt={value.name || "Uploaded image"}
															className="aspect-square h-full min-w-full rounded-rounded"
														/>
													</div>

													<span className="absolute -top-1 -right-1">
														<Button
															onClick={() => {
																setValue("logo", { url: "" });
															}}
															variant="secondary"
															className="rounded-full bg-gray-300 p-1"
															type="button"
														>
															<EditIcon size={16} />
														</Button>
													</span>
												</div>
											) : (
												<FileUploadField
													onFileChosen={handleImage("logo")}
													filetypes={["image/*"]}
													className="ml-auto flex aspect-square w-[100px] items-center justify-center py-large"
													text={"Upload image"}
												/>
											)}
										</>
									)}
								/>{" "}
							</div>

							{/* favicon */}
							<div className="mt-base flex w-full items-center">
								<Controller
									name="favicon"
									control={control}
									render={({ field: { value } }) => (
										<>
											<label className="mb-xsmall text-sm text-gray-600">
												Favicon
											</label>
											{value && value.url ? (
												<div className="relative ml-auto aspect-square w-[100px]">
													<div className="flex h-full w-full items-center justify-center">
														<img
															src={value.url}
															alt={value.name || "Uploaded image"}
															className="aspect-square h-full min-w-full rounded-rounded"
														/>
													</div>

													<span className="absolute -top-1 -right-1">
														<Button
															onClick={() => {
																setValue("favicon", { url: "" });
															}}
															variant="secondary"
															className="rounded-full bg-gray-300 p-1"
															type="button"
														>
															<EditIcon size={16} />
														</Button>
													</span>
												</div>
											) : (
												<FileUploadField
													onFileChosen={handleImage("favicon")}
													filetypes={["image/*"]}
													className="ml-auto flex aspect-square w-[100px] items-center justify-center py-large"
													text={"Upload icon"}
												/>
											)}
										</>
									)}
								/>
							</div>

							{/* banner */}
							<div className="mt-base">
								<label className="mb-xsmall text-sm text-gray-600">
									Banner Image
								</label>

								<Controller
									control={control}
									name="banner_image"
									render={({ field: { value } }) =>
										value && value.url ? (
											<Image
												image={value}
												remove={() => setValue("banner_image", { url: "" })}
											/>
										) : (
											<FileUploadField
												onFileChosen={handleImage("banner_image")}
												filetypes={["image/*"]}
												className="py-large"
											/>
										)
									}
								/>
							</div>
						</div>

						<div>
							<h2 className="inter-base-semibold mb-base">
								{t("settings-advanced-settings", "Advanced settings")}
							</h2>
							<Input
								label={t("settings-swap-link-template", "Swap link template")}
								{...register("swap_link_template")}
								placeholder="https://acme.inc/swap={swap_id}"
							/>
							<Input
								className="mt-base"
								label={t(
									"settings-draft-order-link-template",
									"Draft order link template"
								)}
								{...register("payment_link_template")}
								placeholder="https://acme.inc/payment={payment_id}"
							/>
							<Input
								className="mt-base"
								label={t(
									"settings-invite-link-template",
									"Invite link template"
								)}
								{...register("invite_link_template")}
								placeholder="https://acme-admin.inc/invite?token={invite_token}"
							/>
						</div>
					</div>
				</BodyCard>
			</div>
		</form>
	);
};

const validateUrl = (address: string | undefined) => {
	if (!address || address === "") {
		return true;
	}

	try {
		const url = new URL(address);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch (_) {
		return false;
	}
};

const mapStoreDetails = (store: Store): AccountDetailsFormData => {
	return {
		name: store.name,
		swap_link_template: store.swap_link_template,
		payment_link_template: store.payment_link_template,
		invite_link_template: store.invite_link_template,
		banner_image: { url: store.banner_image || "" },
		logo: { url: store.logo || "" },
		favicon: { url: store.favicon || "" },
		site_name: store.site_name,
	};
};

type ThumbnailProps = {
	image: FormImage;
	remove: () => void;
};

const Image = ({ image, remove }: ThumbnailProps) => {
	return (
		<div className="group relative flex items-center justify-between rounded-rounded px-base py-xsmall hover:bg-grey-5">
			<div className="flex aspect-video w-full items-center justify-center">
				<img
					src={image.url}
					alt={image.name || "Uploaded image"}
					className="aspect-video h-full rounded-rounded object-cover"
				/>
			</div>
			<span className="absolute -top-1 -right-1">
				<Button
					type="button"
					onClick={remove}
					variant="secondary"
					className="rounded-full p-1.5"
				>
					<TrashIcon size={20} />
				</Button>
			</span>
		</div>
	);
};

export default AccountDetails;
