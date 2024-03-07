import {
	CartService,
	MedusaRequest,
	MedusaResponse,
	cleanResponseData,
	defaultStoreCartFields,
	defaultStoreCartRelations,
} from "@medusajs/medusa";
import CartRepository from "@medusajs/medusa/dist/repositories/cart";
import { EntityManager } from "typeorm";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	const { id } = req.params;
	const cartService: CartService = req.scope.resolve("cartService");
	const manager: EntityManager = req.scope.resolve("manager");

	await manager.transaction(async (transactionalEntityManager) => {
		const cartRepo = transactionalEntityManager.withRepository(CartRepository);

		const cart = await cartRepo.findOne({
			where: { id: req.params.id },
		});

		if (cart) {
			await cartRepo.save({ ...cart, deliver_at: req.body.deliver_at });
		}
	});

	const updatedCart = await cartService.retrieve(id, {
		select: defaultStoreCartFields,
		relations: defaultStoreCartRelations,
	});

	res.status(200).json({ cart: cleanResponseData(updatedCart, []) });
};
