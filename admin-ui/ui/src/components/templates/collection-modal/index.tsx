import { ProductCollection } from "@medusajs/medusa";
import {
	useAdminCreateCollection,
	useAdminUpdateCollection,
} from "medusa-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useNotification from "../../../hooks/use-notification";
import { FormImage } from "../../../types/shared";
import { getErrorMessage } from "../../../utils/error-messages";
import { prepareImages } from "../../../utils/images";
import { nestedForm } from "../../../utils/nested-form";
import MetadataForm, {
	MetadataFormType,
	getSubmittableMetadata,
} from "../../forms/general/metadata-form";
import Button from "../../fundamentals/button";
import IconTooltip from "../../molecules/icon-tooltip";
import InputField from "../../molecules/input";
import Modal from "../../molecules/modal";
import { MetadataField } from "../../organisms/metadata";
import CollectionThumbnail from "../collection-thumbnail";

type CollectionModalProps = {
	onClose: () => void;
	onSubmit: (values: any, metadata: MetadataField[]) => void;
	isEdit?: boolean;
	collection?: ProductCollection;
};

type CollectionModalFormData = {
	title: string;
	handle: string | undefined;
	metadata: MetadataFormType;
	thumbnail: FormImage | undefined;
};

const CollectionModal: React.FC<CollectionModalProps> = ({
	onClose,
	isEdit = false,
	collection,
}) => {
	const { t } = useTranslation();
	const { mutate: update, isLoading: updating } = useAdminUpdateCollection(
		collection?.id!
	);
	const { mutate: create, isLoading: creating } = useAdminCreateCollection();

	const form = useForm<CollectionModalFormData>({
		defaultValues: {
			title: collection?.title,
			handle: collection?.handle,
			metadata: {
				entries: Object.entries(collection?.metadata || {}).map(
					([key, value]) => ({
						key,
						value: value as string,
						state: "existing",
					})
				),
			},
			thumbnail: { url: collection?.thumbnail },
		},
	});
	const { register, handleSubmit, reset, control } = form;

	useEffect(() => {
		if (collection) {
			reset({
				title: collection.title,
				handle: collection.handle,
				metadata: {
					entries: Object.entries(collection.metadata || {}).map(
						([key, value]) => ({
							key,
							value: value as string,
							state: "existing",
						})
					),
				},
			});
		}
	}, [collection, reset]);

	const notification = useNotification();

	if (isEdit && !collection) {
		throw new Error("Collection is required for edit");
	}

	const submit = async (data: CollectionModalFormData) => {
		let prepedImages: FormImage[] = [];

		if (data.thumbnail?.nativeFile) {
			try {
				prepedImages = await prepareImages([data.thumbnail]);
			} catch (error) {
				let errorMessage =
					"Something went wrong while trying to upload images.";
				const response = (error as any).response as Response;

				if (response.status === 500) {
					errorMessage = `${errorMessage} You might not have a file service configured. Please contact your administrator.`;
				}

				notification("Error", errorMessage, "error");
				return;
			}
		}

		const url = prepedImages.length > 0 ? prepedImages[0].url : undefined;

		if (isEdit) {
			update(
				{
					title: data.title,
					handle: data.handle,
					metadata: getSubmittableMetadata(data.metadata),
					thumbnail: url,
				},
				{
					onSuccess: () => {
						notification(
							t("collection-modal-success", "Success"),
							t(
								"collection-modal-successfully-updated-collection",
								"Successfully updated collection"
							),
							"success"
						);
						onClose();
					},
					onError: (error) => {
						notification(
							t("collection-modal-error", "Error"),
							getErrorMessage(error),
							"error"
						);
					},
				}
			);
		} else {
			create(
				{
					title: data.title,
					handle: data.handle,
					metadata: getSubmittableMetadata(data.metadata),
					thumbnail: url,
				},
				{
					onSuccess: () => {
						notification(
							t("collection-modal-success", "Success"),
							t(
								"collection-modal-successfully-created-collection",
								"Successfully created collection"
							),
							"success"
						);
						onClose();
					},
					onError: (error) => {
						notification(
							t("collection-modal-error", "Error"),
							getErrorMessage(error),
							"error"
						);
					},
				}
			);
		}
	};

	return (
		<Modal handleClose={onClose} isLargeModal>
			<Modal.Body>
				<Modal.Header handleClose={onClose}>
					<div>
						<h1 className="inter-xlarge-semibold mb-2xsmall">
							{isEdit
								? t("collection-modal-edit-collection", "Edit Collection")
								: t("collection-modal-add-collection", "Add Collection")}
						</h1>
						<p className="inter-small-regular text-grey-50">
							{t(
								"collection-modal-description",
								"To create a collection, all you need is a title and a handle."
							)}
						</p>
					</div>
				</Modal.Header>
				<form onSubmit={handleSubmit(submit)}>
					<Modal.Content>
						<div>
							<h2 className="inter-base-semibold mb-base">
								{t("collection-modal-details", "Details")}
							</h2>
							<div className="gap-x-base flex items-center">
								<InputField
									label={t("collection-modal-title-label", "Title")}
									required
									placeholder={t(
										"collection-modal-title-placeholder",
										"Sunglasses"
									)}
									{...register("title", { required: true })}
								/>
								<InputField
									label={t("collection-modal-handle-label", "Handle")}
									placeholder={t(
										"collection-modal-handle-placeholder",
										"sunglasses"
									)}
									{...register("handle")}
									prefix="/"
									tooltip={
										<IconTooltip
											content={t(
												"collection-modal-slug-description",
												"URL Slug for the collection. Will be auto generated if left blank."
											)}
										/>
									}
								/>
							</div>

							<div className="mt3">
								<label className="inter-small-semibold text-grey-50 flex w-full items-center mb-xsmall">
									{t("collection-modal-thumbnail", "Thumbnail")}
								</label>
								<div className="gap-x-base flex items-center">
									<Controller
										name="thumbnail"
										control={control}
										render={({ field: { onChange, value } }) => (
											<CollectionThumbnail onChange={onChange} value={value} />
										)}
									/>
								</div>
							</div>
						</div>
						<div className="mt-xlarge">
							<h2 className="inter-base-semibold mb-base">
								{t("collection-modal-metadata", "Metadata")}
							</h2>
							<MetadataForm form={nestedForm(form, "metadata")} />
						</div>
					</Modal.Content>
					<Modal.Footer>
						<div className="gap-x-xsmall flex w-full items-center justify-end">
							<Button
								variant="secondary"
								size="small"
								type="button"
								onClick={onClose}
							>
								{t("collection-modal-cancel", "Cancel")}
							</Button>
							<Button
								variant="primary"
								size="small"
								loading={isEdit ? updating : creating}
							>
								{isEdit
									? t("collection-modal-save-collection", "Save collection")
									: t(
											"collection-modal-publish-collection",
											"Publish collection"
									  )}
							</Button>
						</div>
					</Modal.Footer>
				</form>
			</Modal.Body>
		</Modal>
	);
};

export default CollectionModal;
