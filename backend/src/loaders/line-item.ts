export default async function () {
	console.log("start load line item loader");

	try {
		const adminOrderImports = (await import(
			"@medusajs/medusa/dist/types/orders"
		)) as any;

		const storeCartImports = (await import(
			"@medusajs/medusa/dist/api/routes/store/carts/index"
		)) as any;

		const storeOrderImports = (await import(
			"@medusajs/medusa/dist/api/routes/store/orders/index"
		)) as any;

		adminOrderImports.defaultAdminOrdersFields = [
			...adminOrderImports.defaultAdminOrdersFields,
			"deliver_at",
			"items.personal_message",
			"items.image",
		];

		// storeCartImports.defaultStoreCartRelations = [
		// 	...storeCartImports.defaultStoreCartRelations,
		// 	"lines.image",
		// 	"lines.personal_message",
		// ];

		storeOrderImports.defaultStoreOrdersFields = [
			...storeOrderImports.defaultStoreOrdersFields,
			"deliver_at",
			"items.personal_message",
			"items.image",
		];

		storeOrderImports.allowedStoreOrdersFields = [
			...storeOrderImports.allowedStoreOrdersFields,
			"deliver_at",
			"items.personal_message",
			"items.image",
		];
	} catch (err) {
		console.log(err);
	}
}
