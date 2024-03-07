import {
	CartService,
	LineItemService,
	MedusaRequest,
	MedusaResponse,
	cleanResponseData,
	defaultStoreCartFields,
	defaultStoreCartRelations,
} from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import LineItem from "src/models/line-item";
import { EntityManager } from "typeorm";

async function addOrUpdateLineItem({ cartId, container, manager, data }) {
	const cartService: CartService = container.resolve("cartService");
	const lineItemService: LineItemService = container.resolve("lineItemService");

	const cart = await cartService.retrieve(cartId, {
		select: ["id", "region_id", "customer_id"],
	});

	let line = await lineItemService
		.withTransaction(manager)
		.generate(data.variant_id, cart.region_id, data.quantity, {
			customer_id: data.customer_id || cart.customer_id,
			metadata: data.metadata,
		});

	line = {
		...line,
		personal_message: data.personal_message,
		image: data.image,
	} as LineItem;

	await manager.transaction(async (transactionalEntityManager) => {
		const txCartService = cartService.withTransaction(
			transactionalEntityManager
		);

		await txCartService.addOrUpdateLineItems(cart.id, line, {
			validateSalesChannels: false,
		});
	});
}

export default async (req: MedusaRequest, res: MedusaResponse) => {
	const { id } = req.params;
	const validated = req.body;

	const manager: EntityManager = req.scope.resolve("manager");
	const cartService: CartService = req.scope.resolve("cartService");

	console.log({ validated });

	await manager.transaction(async (transactionalEntityManager) => {
		const cart = await cartService
			.withTransaction(transactionalEntityManager)
			.retrieve(id, {
				relations: ["items", "items.variant", "shipping_methods"],
			});

		const existing = cart.items.find(
			(i) => i.variant_id === validated.variant_id
		);

		if (!existing) {
			throw new MedusaError(
				MedusaError.Types.INVALID_DATA,
				"Could not find line item"
			);
		}

		const lineItemUpdate = {
			variant_id: existing.variant.id,
			region_id: cart.region_id,
			personal_message: validated.personal_message,
			image: validated.image,
		};

		await cartService
			.withTransaction(transactionalEntityManager)
			.updateLineItem(cart.id, existing.id, lineItemUpdate);
	});

	const data = await cartService.retrieveWithTotals(id, {
		select: defaultStoreCartFields,
		relations: defaultStoreCartRelations,
	});

	res.status(200).json({ cart: cleanResponseData(data, []) });
};
