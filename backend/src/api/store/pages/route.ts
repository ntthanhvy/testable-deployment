import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";


export async function GET(req:MedusaRequest, res: MedusaResponse) {
  const pageService = req.scope.resolve("pageService");

  const pages = await pageService.findAll();

  res.status(200).json({ pages });
}