import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Button from "../../../components/fundamentals/button";
import FocusModal from "../../../components/molecules/modal/focus-modal";
import useNotification from "../../../hooks/use-notification";

import { Editor } from "@tinymce/tinymce-react";
import CrossIcon from "../../../components/fundamentals/icons/cross-icon";
import InputField from "../../../components/molecules/input";
import Select from "../../../components/molecules/select/next-select/select";
import { Option } from "../../../types/shared";

type Props = {
	closeModal: () => void;
	pageId?: string;
};

type FormValues = {
	title: string;
	slug: string;
	parent_id: Option | null;
	body: string;
	order: number | null;
};

export default function PageModal(props: Props) {
	const { closeModal, pageId } = props;
	const notification = useNotification();

	const { t } = useTranslation();

	const { mutate: create } = useAdminCustomPost("/pages", ["pages", "list"]);
	const { mutate: update } = useAdminCustomPost(`/pages/${pageId}`, [
		"pages",
		"list",
	]);
	const isNew = useMemo(() => !pageId, [pageId]);

	const { data, isLoading } = useAdminCustomQuery(
		`/pages/${pageId}`,
		["pages", "detail"],
		undefined,
		{ enabled: !!pageId }
	);

	const form = useForm<FormValues>({
		defaultValues: mapFormValue(data?.page),
	});

	const { register, reset, control, formState, handleSubmit } = form;
	const { errors } = formState;
	useEffect(() => {
		if (!data || !data.page) return;

		reset(mapFormValue(data.page));
	}, [data]);

	const { data: listPage } = useAdminCustomQuery("/pages", ["pages", "list"]);

	const onSubmit = async (data: FormValues) => {
		try {
			if (isNew) {
				create(
					{
						...data,
						parent_id: data.parent_id?.value,
					},
					{
						onSuccess: () => {
							notification(
								t("pages-success", "Success"),
								t("pages-created-the-page", "Page created"),
								"success"
							);
						},
					}
				);
			} else {
				update(
					{
						...data,
						parent_id: data.parent_id?.value,
					},
					{
						onSuccess: () => {
							notification(
								t("pages-success", "Success"),
								t("pages-updated-the-page", "Page updated"),
								"success"
							);
						},
					}
				);
			}
			closeModal();
		} catch (err) {
			console.log(err);
			notification(
				t("pages-error", "Error"),
				t("pages-error-creating-page", "Error creating/updating page"),
				"error"
			);
		}
	};

	const editorRefTiny = useRef<Editor["editor"] | null>(null);
	const inputImageRef = useRef<HTMLInputElement | null>(null);

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
							{t("pages-page", "Save and close")}
						</Button>
					</div>
				</div>
			</FocusModal.Header>

			<FocusModal.Main className="flex w-full justify-center">
				<div className="medium:w-7/12 large:w-6/12 small:w-4/5 my-16 max-w-[700px]">
					<h1 className="inter-xlarge-semibold text-grey-90 pb-8">
						{t("pages-create-page", "Create Page")}
					</h1>

					<div className="grid grid-cols-2 gap-3">
						<InputField
							label="Title"
							type="string"
							{...register("title", { required: true })}
							className="w-[338px]"
							placeholder="Page title"
						/>
						<InputField
							label="Slug"
							type="string"
							{...register("slug", { required: true })}
							className="w-[338px]"
							placeholder="Page slug"
						/>
						<Controller
							name="parent_id"
							control={control}
							render={({ field }) => (
								<Select
									label="Parent"
									placeholder="Select parent"
									options={
										listPage && listPage.pages
											? listPage.pages.map((page: any) => ({
													value: page.id,
													label: page.title,
											  }))
											: []
									}
									onChange={(val: any) => field.onChange(val)}
									value={field.value}
								/>
							)}
						/>

						<InputField
							label="Order"
							type="number"
							{...register("order")}
							className="w-[338px]"
							placeholder="Page order"
							min={0}
						/>

						<div className="col-span-full">
							<Controller
								name="body"
								control={control}
								render={({ field }) => (
									<>
										<Editor
											onInit={(evt, editor) => (editorRefTiny.current = editor)}
											value={field.value}
											// onChange={field.onChange}
											init={{
												height: 500,
												menubar: true,
												plugins: [
													"advlist",
													"autolink",
													"lists",
													"link",
													"image",
													"preview",
													"anchor",
													"searchreplace",
													"visualblocks",
													"code",
													"fullscreen",
													"insertdatetime",
													"media",
													"code",
													"wordcount",
												],
												toolbar:
													"undo redo | styleselect | bold italic forecolor | link | image",
												color_cols: 5,
												a11y_advanced_options: true,
												automatic_uploads: true,
												file_picker_types: "image",
												file_picker_callback(callback, value, meta) {
													if (inputImageRef.current) {
														inputImageRef.current.addEventListener(
															"change",
															// @ts-ignore
															(ev: ChangeEvent<HTMLInputElement>) => {
																const file = ev.target?.files
																	? ev.target.files[0]
																	: null;
																if (!file || !editorRefTiny.current) return;

																const reader = new FileReader();
																reader.addEventListener("load", () => {
																	const id = "blobid" + new Date().getTime();
																	const blobCache =
																		editorRefTiny.current!.editorUpload
																			.blobCache;
																	const base64 = (
																		reader.result as string
																	).split(",")[1];
																	const blobInfo = blobCache.create(
																		id,
																		file,
																		base64
																	);
																	blobCache.add(blobInfo);

																	callback(blobInfo.blobUri(), {
																		title: file.name,
																	});
																});
																reader.readAsDataURL(file);
															}
														);

														inputImageRef.current.click();
													}
												},
												content_style:
													"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
											}}
											tinymceScriptSrc="/public/tinymce/tinymce.min.js"
											onEditorChange={(content: string) => {
												field.onChange(content);
											}}
										/>

										<input
											type="file"
											accept="image/*"
											ref={inputImageRef}
											hidden
										/>
									</>
								)}
							/>
						</div>
					</div>
				</div>
			</FocusModal.Main>
		</FocusModal>
	);
}

function mapFormValue(page: any | undefined): FormValues {
	if (!page) {
		return {
			title: "",
			slug: "",
			parent_id: null,
			body: "",
			order: null,
		};
	}

	return {
		title: page.title,
		slug: page.slug,
		parent_id: page.parent_id
			? { value: page.parent_id, label: page.parent.title }
			: null,
		body: page.body,
		order: page.order,
	};
}
