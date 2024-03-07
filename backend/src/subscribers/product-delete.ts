import { ProductService, SubscriberArgs } from "@medusajs/medusa";
import KlevuService from "../services/klevu";

export default async function productCreateHandler({
	data,
	eventName,
	container,
}: SubscriberArgs<Record<string, any>>) {
	const klevuService: KlevuService = container.resolve("klevuService");

	const product_id = data.id as string;

	await klevuService.removeIndex(product_id);
}

export const config = {
	event: ProductService.Events.DELETED,
	context: {
		subscriberId: "product-detail-create",
	},
};
