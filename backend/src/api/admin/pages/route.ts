import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PageService from "src/services/page";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const pageService: PageService = req.scope.resolve("pageService");

	const pages = await pageService.findAll();

	res.status(200).json({ pages });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const pageService: PageService = req.scope.resolve("pageService");

  const page = await pageService.create(req.body);

  res.status(200).json({ page });
}
