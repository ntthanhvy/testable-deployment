import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import KlevuService from "src/services/klevu";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const klevuService: KlevuService = req.scope.resolve("klevuService");

	const result = await klevuService.indexProducts();

	return res.json(result);
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
	const klevuService: KlevuService = req.scope.resolve("klevuService");

	const result = await klevuService.removeRecords();

	return res.json(result);
}
