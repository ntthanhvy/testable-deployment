import { ProductService, SubscriberArgs } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import Product from "src/models/product";
import KlevuService from "../services/klevu";

export default async function productCreateHandler({
	data,
	eventName,
	container,
}: SubscriberArgs<Record<string, any>>) {
	const productService: ProductService = container.resolve("productService");
	const klevuService: KlevuService = container.resolve("klevuService");

	const product_id = data.id as string;

	const product = await productService.retrieve(product_id, {
		relations: ["variants", "collection", "categories"],
	});

	if (!product) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			`Product with id: ${product_id} was not found`
		);
	}

	await klevuService.indexProduct(product as Product);
}

export const config = {
	event: ProductService.Events.CREATED,
	context: {
		subscriberId: "product-detail-create",
	},
};
