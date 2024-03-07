import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PageService from "src/services/page";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const pageService: PageService = req.scope.resolve("pageService");
	const page = await pageService.findOne(req.params.id);

	res.status(200).json({ page });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const pageService: PageService = req.scope.resolve("pageService");
  const page = await pageService.update(req.params.id, req.body);

  res.status(200).json({ page });
}