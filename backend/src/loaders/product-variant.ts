export default async function () {
	console.log("start run loader");

	try {
		// products
		const adminProductImports = (await import(
			"@medusajs/medusa/dist/api/routes/admin/products/index"
		)) as any;

		const storeProductImports = (await import(
			"@medusajs/medusa/dist/api/routes/store/products/index"
		)) as any;

		adminProductImports.defaultAdminProductFields = [
			...adminProductImports.defaultAdminProductFields,
			"personalized_message",
		];

		storeProductImports.defaultStoreProductsFields = [
			...storeProductImports.defaultStoreProductsFields,
			"personalized_message",
		];

		storeProductImports.allowedStoreProductsFields = [
			...storeProductImports.allowedStoreProductsFields,
			"personalized_message",
		];
		console.log("done init product");

		// variant
		console.log("start init variant");
		const adminVariantsImports = (await import(
			"@medusajs/medusa/dist/api/routes/admin/variants/index"
		)) as any;

		const storeVariantsImports = (await import(
			"@medusajs/medusa/dist/api/routes/store/variants/index"
		)) as any;

		adminVariantsImports.defaultAdminVariantRelations = [
			...adminVariantsImports.defaultAdminVariantRelations,
			"size",
			"shape",
			"nutritic_code",
			"meta_title",
			"meta_description",
			"character_limit",
			"image_upload",
			"meta_keywords",
		];

		storeVariantsImports.defaultStoreVariantRelations = [
			...storeVariantsImports.defaultStoreVariantRelations,
			"size",
			"shape",
			"nutritic_code",
			"meta_title",
			"meta_description",
			"character_limit",
			"image_upload",
			"meta_keywords",
		];

		storeVariantsImports.allowedStoreVariantRelations = [
			...storeVariantsImports.allowedStoreVariantRelations,
			"size",
			"shape",
			"nutritic_code",
			"meta_title",
			"meta_description",
			"character_limit",
			"image_upload",
			"meta_keywords",
		];
		console.log("done init variant");
	} catch (error) {
		console.log(error);
	}

	console.log("loader of variant");
}
