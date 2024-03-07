import { MedusaRequest, MedusaResponse, StoreService } from "@medusajs/medusa";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const storeService: StoreService = req.scope.resolve("storeService");

	const store = await storeService.retrieve({
		select: ["banner_image" as any, "favicon", "logo", "site_name"],
	});

	return res.json({ store });
}
