import { AnalyticsConfig } from "@medusajs/medusa";
import { useAdminCustomDelete, useAdminCustomQuery } from "medusa-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/fundamentals/button";
import Modal from "../../../../components/molecules/modal";
import AnalyticsConfigForm, {
	AnalyticsConfigFormType,
} from "../../../../components/organisms/analytics-config-form";
import useNotification from "../../../../hooks/use-notification";
import { useAdminUpdateAnalyticsConfig } from "../../../../services/analytics";
import { getErrorMessage } from "../../../../utils/error-messages";
import { nestedForm } from "../../../../utils/nested-form";

type Props = {
	config: AnalyticsConfig;
	open: boolean;
	onClose: () => void;
};

const UsageInsightsModal = ({ config, open, onClose }: Props) => {
	const { t } = useTranslation();
	const { mutate, isLoading: isSubmitting } = useAdminUpdateAnalyticsConfig();

	const form = useForm<AnalyticsConfigFormType>({
		defaultValues: {
			opt_out: config.opt_out,
			anonymize: config.anonymize,
		},
	});

	const { handleSubmit, reset } = form;

	useEffect(() => {
		reset({
			opt_out: config.opt_out,
			anonymize: config.anonymize,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, config]);

	const notification = useNotification();

	const onSubmit = handleSubmit((data) => {
		mutate(data, {
			onSuccess: () => {
				notification(
					t("usage-insights-success", "Success"),
					t(
						"usage-insights-your-information-was-successfully-updated",
						"Your information was successfully updated"
					),
					"success"
				);
				onClose();
			},
			onError: (err) => {
				notification(
					t("usage-insights-error", "Error"),
					getErrorMessage(err),
					"error"
				);
			},
		});
	});

	const { refetch: syncProduct } = useAdminCustomQuery(
		"/sync/products",
		["sync-products"],
		undefined,
		{
			enabled: false,
			onSuccess: (res) => {
				const { message } = res;

				if (message?.status?.[0] === "SUCCESS") {
					const msg = message?.msg?.[0];
					notification(
						"Success",
						msg || "Successfully synced products",
						"success"
					);
				} else {
					const msg = message?.msg?.[0];
					notification("Error", msg || "Failed to sync products", "error");
				}
			},
		}
	);

	const onSyncProduct = () => {
		syncProduct({});
	};

	const { mutate: removeSyncProducts } = useAdminCustomDelete(
		"/sync/products",
		["sync-products"],
		undefined,
		{
			onSuccess: (res) => {
				const { status } = res.response;

				if (status === 200) {
					notification(
						"Success",
						"Successfully remove synced products",
						"success"
					);
				} else {
					notification("Error", "Failed to remove sync products", "error");
				}
			},
		}
	);

	const onRemoveSyncProducts = () => {
		removeSyncProducts();
	};

	return (
		<Modal handleClose={onClose} open={open} isLargeModal={true}>
			<Modal.Header handleClose={onClose}>
				<h1 className="inter-xlarge-semibold">
					{t("usage-insights-edit-preferences", "Edit preferences")}
				</h1>
			</Modal.Header>
			<Modal.Body>
				<Modal.Content>
					<AnalyticsConfigForm form={nestedForm(form)} />

					<div className="flex w-full gap-5 mt-8">
						<Button variant={"secondary"} size="small" onClick={onSyncProduct}>
							{t("sync-products", "Sync Products")}
						</Button>
						<Button
							variant={"danger"}
							size="small"
							onClick={onRemoveSyncProducts}
						>
							{t("remove-sync-products", " Remove Sync Products")}
						</Button>
					</div>
				</Modal.Content>
				<Modal.Footer className="border-grey-20 pt-base border-t">
					<div className="gap-x-xsmall flex w-full items-center justify-end">
						<Button variant="secondary" size="small" onClick={onClose}>
							{t("usage-insights-cancel", "Cancel")}
						</Button>
						<Button
							variant="primary"
							size="small"
							loading={isSubmitting}
							disabled={isSubmitting}
							onClick={onSubmit}
						>
							{t("usage-insights-submit-and-close", "Submit and close")}
						</Button>
					</div>
				</Modal.Footer>
			</Modal.Body>
		</Modal>
	);
};

export default UsageInsightsModal;
