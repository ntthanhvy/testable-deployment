import { ProductVariantService, SubscriberArgs } from "@medusajs/medusa";
import KlevuService from "../services/klevu";

export default async function productCreateHandler({
	data,
	eventName,
	container,
}: SubscriberArgs<Record<string, any>>) {
	const klevuService: KlevuService = container.resolve("klevuService");

	const product_variant_id = data.id as string;
	const product_id = data.product_id as string;

	await klevuService.removeVariantIndex(product_id, product_variant_id);
}

export const config = {
	event: ProductVariantService.Events.DELETED,
	context: {
		subscriberId: "product-variant-delete",
	},
};
