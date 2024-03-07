export default async function () {
	try {
		const adminStoreImports = (await import(
			"@medusajs/medusa/dist/api/routes/admin/store/index"
		)) as any;
		const storeStoreImports = await import(
			"@medusajs/medusa/dist/api/routes/store/index"
		);

		// adminStoreImports.defaultRelationsExtended = [
		// 	...adminStoreImports.defaultRelationsExtended,
		// 	"logo",
		// 	"favicon",
		// 	"banner_image",
		// 	"site_name",
		// ];
	} catch (err) {
		console.log(err);
	}
}
