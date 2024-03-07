import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import StoreLocationService from "../../../../services/store-location";

// get one by id
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const storeLocationService: StoreLocationService = req.scope.resolve(
		"storeLocationService"
	);

	const store = await storeLocationService.retrieve(req.params.id);

	res.status(200).json({ store });
};

// update one by id
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	const storeLocationService: StoreLocationService = req.scope.resolve(
		"storeLocationService"
	);

	const store = await storeLocationService.update(req.params.id, req.body);

	res.status(200).json({ store });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
	const storeLocationService: StoreLocationService = req.scope.resolve(
		"storeLocationService"
	);

	const store = await storeLocationService.delete(req.params.id);

	res.status(200).json({ store });
};
