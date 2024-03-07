export default async function () {
	console.log("start run collection loader ");

	try {
		const adminCollectionImports = (await import(
			"@medusajs/medusa/dist/api/routes/admin/collections/index"
		)) as any;

		const storeCollectionImports = (await import(
			"@medusajs/medusa/dist/api/routes/store/collections/index"
		)) as any;

		adminCollectionImports.defaultAdminCollectionsFields = [
			...adminCollectionImports.defaultAdminCollectionsFields,
			"thumbnail",
		];

		storeCollectionImports.defaultStoreCollectionRelations = [
			...storeCollectionImports.defaultStoreCollectionRelations,
			"thumbnail",
		];

		storeCollectionImports.allowedFields = [
			...storeCollectionImports.allowedFields,
			"thumbnail",
		];
	} catch (err) {
		console.log("error load collection loader");
		console.log(err);
	}
}
