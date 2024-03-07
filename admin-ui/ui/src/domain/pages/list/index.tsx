import { useToggleState } from "@medusajs/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Fade from "../../../components/atoms/fade-wrapper";
import BodyCard from "../../../components/organisms/body-card";
import PageModal from "../modal";
import PageTable from "../table";

export default function List() {
	const { t } = useTranslation();

	const [isModalOpen, openModal, closeModal] = useToggleState(false);

	const actions = [
		{
			label: t("pages-create-page-label", "Create Page"),
			onClick: openModal,
		},
	];

	const [pageId, setPageId] = useState<undefined | string>(undefined);

	return (
		<div>
			<BodyCard title={t("pages-pages", "Pages")} actionables={actions}>
				<PageTable showDetail={setPageId} />

				<Fade isVisible={isModalOpen || pageId !== undefined} isFullScreen>
					<PageModal
						closeModal={() => {
							closeModal();
							if (pageId) setPageId(undefined);
						}}
						pageId={pageId}
					/>
				</Fade>
			</BodyCard>
		</div>
	);
}
