import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductCollectionRepository from "@medusajs/medusa/dist/repositories/product-collection";
import { EntityManager } from "typeorm";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const productCollectionRepository = req.scope.resolve<
		typeof ProductCollectionRepository
	>("productCollectionRepository");
	const manager = req.scope.resolve<EntityManager>("manager");
	const productCollRepo = manager.withRepository(productCollectionRepository);

	const query = req.query;

	const qb = productCollRepo.createQueryBuilder();

	if (query.homepage) {
		qb.where("metadata::jsonb->>'homepage' = :homepage", {
			homepage: query.homepage,
		});
	}

	if (query.topnav) {
		qb.where("metadata::jsonb->>'topnav' = :topnav", {
			topnav: query.topnav,
		});
	}

	const [collections, count] = await qb.getManyAndCount();

	return res.status(200).json({ collections, count });
};
