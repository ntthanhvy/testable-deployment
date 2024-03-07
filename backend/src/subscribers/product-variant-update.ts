import { ProductVariantService, SubscriberArgs } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import ProductVariant from "src/models/product-variant";
import KlevuService from "../services/klevu";

export default async function productCreateHandler({
	data,
	eventName,
	container,
}: SubscriberArgs<Record<string, any>>) {
	const productVariantService: ProductVariantService = container.resolve(
		"productVariantService"
	);
	const klevuService: KlevuService = container.resolve("klevuService");

	const product_variant_id = data.id as string;

	const productVariant = await productVariantService.retrieve(
		product_variant_id,
		{
			relations: ["prices", "product", "options"],
		}
	);

	if (!productVariant) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			`Product with id: ${product_variant_id} was not found`
		);
	}

	await klevuService.indexVariant(productVariant as ProductVariant);
}

export const config = {
	event: ProductVariantService.Events.UPDATED,
	context: {
		subscriberId: "product-variant-update",
	},
};
