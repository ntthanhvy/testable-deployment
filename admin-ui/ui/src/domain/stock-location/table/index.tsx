import { useAdminCustomDelete, useAdminCustomQuery } from "medusa-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Translation, useTranslation } from "react-i18next";
import { Column, Row, usePagination, useTable } from "react-table";
import EditIcon from "../../../components/fundamentals/icons/edit-icon";
import TrashIcon from "../../../components/fundamentals/icons/trash-icon";
import { ActionType } from "../../../components/molecules/actionables";
import Table from "../../../components/molecules/table";
import DeletePrompt from "../../../components/organisms/delete-prompt";
import TableContainer from "../../../components/organisms/table-container";
import { StoreLocation } from "../../../types/extensions";

const PAGE_SIZE = 12;

const COLUMNS: Column<StoreLocation>[] = [
	{
		accessor: "name",
		Header: (
			<div className="text-small font-semibold text-gray-500">
				<Translation>{(t) => t("tables-name", "Name")}</Translation>
			</div>
		),
		Cell: ({ row: { original } }) => {
			return <span className="text-gray-900">{original.name}</span>;
		},
	},
	{
		accessor: "code",
		Header: (
			<div className="text-small font-semibold text-gray-500">
				{" "}
				<Translation>{(t) => t("stock-location-code", "Code")}</Translation>
			</div>
		),
		Cell: ({ row: { original } }) => {
			return <span className="text-gray-900">{original.code}</span>;
		},
	},
	{
		accessor: "created_at",
		Header: (
			<div className="text-small font-semibold text-gray-500">
				{" "}
				<Translation>{(t) => t("tables-created", "Created")}</Translation>
			</div>
		),
		Cell: ({ row: { original } }) => {
			return (
				<span className="text-gray-900">
					{moment(original.created_at).format("MMM Do YYYY, h:mm:ss")}
				</span>
			);
		},
	},
];

type StoreLocationTableRowProps = {
	row: Row<StoreLocation>;
	showDetails: () => void;
};

function StoreLocationTableRow(props: StoreLocationTableRowProps) {
	const { row, showDetails } = props;
	const storeId = row.original.id;

	const [showDelete, setShowDelete] = useState(false);

	const { t } = useTranslation();

	const actions: ActionType[] = [
		{
			label: t(
				"tables-edit-store-location-details",
				"Edit Store Location details"
			),
			onClick: showDetails,
			icon: <EditIcon size={16} />,
		},

		{
			label: t("tables-delete-store-location", "Delete Store Location"),
			onClick: () => setShowDelete(true),
			icon: <TrashIcon size={16} />,
			variant: "danger",
		},
	];

	const { mutateAsync: deletePublicKey } = useAdminCustomDelete(
		`/store-locations/${storeId}`,
		["store-locations", "list"]
	);

	return (
		<>
			<Table.Row {...props.row.getRowProps()} actions={actions}>
				{props.row.cells.map((cell) => (
					<Table.Cell {...cell.getCellProps()}>
						{cell.render("Cell")}
					</Table.Cell>
				))}
			</Table.Row>

			{showDelete && (
				<DeletePrompt
					handleClose={() => setShowDelete(false)}
					onDelete={async () => deletePublicKey()}
					confirmText={t("tables-yes-delete", "Yes, delete")}
					successText={t("tables-store-location-deleted", "Store deleted")}
					text={t(
						"sure-to-delete-store",
						"Are you sure you want to delete this store?"
					)}
					heading={t("tables-delete-key", "Delete store")}
				/>
			)}
		</>
	);
}

type StoreLocationTableProps = {
	showDetailsModal: (store: StoreLocation) => void;
};

export default function StoreLocationTable(props: StoreLocationTableProps) {
	const [offset, setOffset] = useState(0);
	const [numPages, setNumPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const { t } = useTranslation();

	const { data, isLoading } = useAdminCustomQuery(
		"/store-locations",
		["store-locations", "list"],
		{ limit: PAGE_SIZE, offset }
	);

	const table = useTable(
		{
			columns: COLUMNS,
			data: data?.stores || [],
			manualPagination: true,
			initialState: {
				pageIndex: currentPage,
				pageSize: PAGE_SIZE,
				selectedRowIds: {},
			},
			pageCount: numPages,
			autoResetSelectedRows: false,
			autoResetPage: false,
			getRowId: (row) => row.id,
		},
		usePagination
	);

	useEffect(() => {
		if (typeof data?.count !== "undefined") {
			setNumPages(Math.ceil(data?.count / PAGE_SIZE));
		}
	}, [data]);

	const handleNext = () => {
		if (table.canNextPage) {
			setOffset((old) => old + table.state.pageSize);
			setCurrentPage((old) => old + 1);
			table.nextPage();
		}
	};

	const handlePrev = () => {
		if (table.canPreviousPage) {
			setOffset((old) => Math.max(old - table.state.pageSize, 0));
			setCurrentPage((old) => old - 1);
			table.previousPage();
		}
	};

	return (
		<TableContainer
			hasPagination
			isLoading={isLoading}
			numberOfRows={PAGE_SIZE}
			pagingState={{
				count: data?.count || 0,
				offset,
				title: t("tables-stock-location", "Stock Locations"),
				pageCount: table.pageCount,
				pageSize: offset + table.rows.length,
				currentPage: table.state.pageIndex + 1,
				nextPage: handleNext,
				prevPage: handlePrev,
				hasNext: table.canNextPage,
				hasPrev: table.canPreviousPage,
			}}
		>
			<Table {...table.getTableProps()}>
				{/* === HEADER === */}

				<Table.Head>
					{table.headerGroups.map((headerGroup) => (
						<Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((col) => (
								<Table.HeadCell {...col.getHeaderProps()}>
									{col.render("Header")}
								</Table.HeadCell>
							))}
						</Table.HeadRow>
					))}
				</Table.Head>

				{/* === BODY === */}
				<Table.Body {...table.getTableBodyProps()}>
					{table.rows.map((row) => {
						table.prepareRow(row);
						return (
							<StoreLocationTableRow
								key={row.id}
								row={row}
								showDetails={() => props.showDetailsModal(row.original)}
							/>
						);
					})}
				</Table.Body>
			</Table>
		</TableContainer>
	);
}
