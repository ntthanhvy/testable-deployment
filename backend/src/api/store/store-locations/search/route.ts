import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import StoreLocationService from "../../../../services/store-location";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const storeLocationService: StoreLocationService = req.scope.resolve(
		"storeLocationService"
	);

	const query = req.query;

	console.log(query);

	const stores = await storeLocationService.search({ s: query.s as string });

	res.status(200).json({ stores });
};
