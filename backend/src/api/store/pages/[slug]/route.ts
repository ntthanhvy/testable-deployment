import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PageService from "src/services/page";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const pageService: PageService = req.scope.resolve("pageService");

	const page = await pageService.findBySlug(req.params.slug);

	res.status(200).json({ page });
}
