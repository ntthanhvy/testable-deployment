import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import StoreLocationService from "../../../services/store-location";

// get all
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const storeLocationService: StoreLocationService = req.scope.resolve(
		"storeLocationService"
	);

	const stores = await storeLocationService.findAll();

	res.status(200).json({ stores });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	const storeLocationService: StoreLocationService = req.scope.resolve(
		"storeLocationService"
	);

	console.log(req.body);

	const store = await storeLocationService.create(req.body);

	res.status(200).json({ store });
};
