import { ProductService, TransactionBaseService } from "@medusajs/medusa";
import { Lifetime } from "awilix";
import Product from "src/models/product";
import ProductVariant from "src/models/product-variant";
import xml2js from "xml2js";
import builder from "xmlbuilder";

type IndexProduct = {
	id: string; // variant id
	itemGroupId: string; // product id
	name: string; // product name
	sku: string; // variant sku
	url: string; // product url
	currency: string; // currency
	price: number; // price of variant
	inStock: string; // in stock
	category: string;
	listCategory: string;
	image?: string;
	desc?: string;
	other?: string;
	rating?: string;
	rating_count?: string;
	additionalDataToReturn?: string;
};

const REST_API_KEY = process.env.KLEVU_REST_API_KEY;
const BASE_XML_URL = process.env.KLEVU_BASE_XML_URL;

class KlevuService extends TransactionBaseService {
	private productService_: ProductService;
	private sessionID: string;
	private productUrl_: string;

	static LIFE_TIME = Lifetime.SINGLETON;

	constructor(containter) {
		super(containter);
		this.productService_ = containter.productService;

		this.initService();
		this.productUrl_ = process.env.STORE_URL + "/products/";
	}

	async initService() {
		console.log("init klevu service");
		const response = await fetch(BASE_XML_URL + "/startSession", {
			method: "POST",
			headers: {
				Authorization: REST_API_KEY,
			},
		});
		const data = await response.text();

		const parsed = await xml2js.parseStringPromise(data);
		console.log(parsed);

		this.sessionID = parsed.message.sessionId[0];
	}

	async indexProducts() {
		const products = await this.productService_.list(
			{},
			{ relations: ["variants", "collection"] }
		);

		const indexProducts = [];

		for (const parentProduct of products) {
			// const variants: ProductVariant[] =
			// await this.productService_.retrieveVariants(parentProduct.id);
			const product = await this.productService_.retrieve(parentProduct.id, {
				relations: [
					"variants",
					"variants.prices",
					"variants.options",
					"variants.options.option",
					"collection",
				],
			});

			const variants = product.variants;

			if (variants && variants.length > 0) {
				// await this.pricingService_.setAdminProductPricing([product]);

				for (const variant of variants) {
					const prices = variant.prices;
					if (!prices || !prices.length) continue;

					// console.log(variant.options);

					let indexProduct: IndexProduct = {
						id: variant.id,
						itemGroupId: product.id,
						name: product.title,
						sku: variant.sku,
						url: this.productUrl_ + product.handle,
						currency: prices[0].currency_code,
						price: prices[0].amount ?? 0,
						inStock: variant.inventory_quantity > 0 ? "yes" : "no",
						category: product.collection?.title,
						listCategory: `KLEVU_PRODUCT;${product.collection?.title};`,
						image: product.thumbnail,
						desc: product.description,
						other: variant.options
							.map((opt) => `${opt.option?.title}:${opt.value}`)
							.join(";"),
						additionalDataToReturn: JSON.stringify({
							handle: product.handle,
							shape: (variant as any).shape,
							size: (variant as any).size,
						}),
					};

					indexProducts.push(indexProduct);
				}
			} else {
				let indexProduct: IndexProduct = {
					id: product.id,
					itemGroupId: product.id,
					name: product?.title,
					sku: product.id,
					url: this.productUrl_ + product.handle,
					currency: "GBP",
					price: 0,
					inStock: "yes",
					category: product.collection?.title,
					listCategory: `KLEVU_PRODUCT;${product.collection?.title};`,
					image: product.thumbnail,
					desc: product.description,
					other: "",
					additionalDataToReturn: JSON.stringify({
						handle: product.handle,
					}),
				};

				indexProducts.push(indexProduct);
			}
		}

		try {
			console.log(`products: ${indexProducts.length}`);
			const xml = this.buildXML(indexProducts);
			// console.log(xml);
			// fs.writeFileSync("klevu.xml", xml);

			const response = await fetch(BASE_XML_URL + "/addRecords", {
				method: "POST",
				headers: {
					"Content-Type": "application/xml",
				},
				body: xml,
			});
			const data = await response.text();
			console.log(data);

			const parsed = await xml2js.parseStringPromise(data);
			console.log(parsed);

			return parsed;
		} catch (err) {
			console.log(err);

			return err;
		}
	}

	async removeRecords() {
		const products = await this.productService_.list(
			{},
			{ relations: ["variants"] }
		);

		const indexProducts = [];

		for (const product of products) {
			if (product.variants.length <= 0) {
				indexProducts.push({
					id: product.id,
					itemGroupId: product.id,
				});
			} else {
				for (const variant of product.variants) {
					indexProducts.push({
						id: variant.id,
						itemGroupId: product.id,
					});
				}
			}
		}

		const xml = this.buildXML(indexProducts);

		const response = await fetch(BASE_XML_URL + "/deleteRecords", {
			method: "POST",
			headers: {
				"Content-Type": "application/xml",
			},
			body: xml,
		});

		const data = await response.text();

		return xml2js.parseStringPromise(data);
	}

	async indexProduct(product: Product) {
		let indexProducts = [];

		const variants = product.variants;

		if (variants && variants.length > 0) {
			// await this.pricingService_.setAdminProductPricing([product]);

			for (const variant of variants) {
				const prices = variant.prices;
				if (!prices || !prices.length) continue;

				// console.log(variant.options);

				let indexProduct: IndexProduct = {
					id: variant.id,
					itemGroupId: product.id,
					name: product.title,
					sku: variant.sku,
					url: this.productUrl_ + product.handle,
					currency: prices[0].currency_code,
					price: prices[0].amount ?? 0,
					inStock: variant.inventory_quantity > 0 ? "yes" : "no",
					category: product.collection?.title,
					listCategory: `KLEVU_PRODUCT;${product.collection?.title};`,
					image: product.thumbnail,
					desc: product.description,
					other: variant.options
						.map((opt) => `${opt.option?.title}:${opt.value}`)
						.join(";"),
					additionalDataToReturn: JSON.stringify({
						handle: product.handle,
						shape: (variant as any).shape,
						size: (variant as any).size,
					}),
				};

				indexProducts.push(indexProduct);
			}
		} else {
			let indexProduct: IndexProduct = {
				id: product.id,
				itemGroupId: product.id,
				name: product?.title,
				sku: product.id,
				url: this.productUrl_ + product.handle,
				currency: "GBP",
				price: 0,
				inStock: "yes",
				category: product.collection?.title,
				listCategory: `KLEVU_PRODUCT;${product.collection?.title};`,
				image: product.thumbnail,
				desc: product.description,
				other: "",
				additionalDataToReturn: JSON.stringify({
					handle: product.handle,
				}),
			};

			indexProducts.push(indexProduct);
		}

		try {
			console.log(`products: ${indexProducts.length}`);
			const xml = this.buildXML(indexProducts);
			// console.log(xml);
			// fs.writeFileSync("klevu.xml", xml);

			const response = await fetch(BASE_XML_URL + "/addRecords", {
				method: "POST",
				headers: {
					"Content-Type": "application/xml",
				},
				body: xml,
			});
			const data = await response.text();
			console.log(data);

			const parsed = await xml2js.parseStringPromise(data);
			// console.log(parsed);

			return parsed;
		} catch (err) {
			console.log(err);

			return err;
		}
	}

	async removeIndex(id: string) {
		const indexProducts = [];

		// if (product.variants.length <= 0) {
		// 	indexProducts.push({
		// 		id: product.id,
		// 		itemGroupId: product.id,
		// 	});
		// } else {
		// 	for (const variant of product.variants) {
		indexProducts.push({
			id: id,
			itemGroupId: id,
		});
		// }
		// }

		const xml = this.buildXML(indexProducts);

		const response = await fetch(BASE_XML_URL + "/deleteRecords", {
			method: "POST",
			headers: {
				"Content-Type": "application/xml",
			},
			body: xml,
		});

		const data = await response.text();
		console.log(data);

		return xml2js.parseStringPromise(data);
	}

	async indexVariant(variant: ProductVariant) {
		const product = await this.productService_.retrieve(variant.product_id, {
			relations: ["variants", "collection"],
		});

		const indexProduct: IndexProduct = {
			id: variant.id,
			itemGroupId: product.id,
			name: product.title,
			sku: variant.sku,
			url: this.productUrl_ + product.handle,
			currency: variant.prices[0]?.currency_code || "GBP",
			price: variant.prices[0]?.amount ?? 0,
			inStock: variant.inventory_quantity > 0 ? "yes" : "no",
			category: product.collection?.title,
			listCategory: `KLEVU_PRODUCT;${product.collection?.title};`,
			image: product.thumbnail,
			desc: product.description,
			other: variant.options
				.map((opt) => `${opt.option?.title}:${opt.value}`)
				.join(";"),
			additionalDataToReturn: JSON.stringify({
				handle: product.handle,
				size: (variant as any).size,
				shape: (variant as any).shape,
			}),
		};

		try {
			const xml = this.buildXML([indexProduct]);
			// console.log(xml);
			// fs.writeFileSync("klevu.xml", xml);

			const response = await fetch(BASE_XML_URL + "/addRecords", {
				method: "POST",
				headers: {
					"Content-Type": "application/xml",
				},
				body: xml,
			});
			const data = await response.text();
			console.log(data);

			const parsed = await xml2js.parseStringPromise(data);
			// console.log(parsed);

			return parsed;
		} catch (err) {
			console.log(err);

			return err;
		}
	}

	async removeVariantIndex(product_id: string, variant_id: string) {
		const indexProducts = [];

		indexProducts.push({
			id: variant_id,
			itemGroupId: product_id,
		});

		const xml = this.buildXML(indexProducts);

		const response = await fetch(BASE_XML_URL + "/deleteRecords", {
			method: "POST",
			headers: {
				"Content-Type": "application/xml",
			},
			body: xml,
		});

		const data = await response.text();
		console.log(data);

		return xml2js.parseStringPromise(data);
	}

	private buildXML(indexProducts: IndexProduct[]) {
		const xmlData = {
			request: {
				sessionId: {
					"#text": this.sessionID,
				},
				records: {
					record: indexProducts.map((ip) => ({
						pairs: {
							pair: Object.entries(ip).map(([key, value]) => ({
								key,
								value: ["url", "image", "handle"].includes(key)
									? value
									: typeof value === "string"
									? value.replace(/&/g, "&amp;").replace(/-/g, "&#45;")
									: value,
							})),
						},
					})),
				},
			},
		};
		// console.log(xmlData);

		return builder.create(xmlData, { encoding: "utf-8" }).end({ pretty: true });
	}
}

export default KlevuService;
