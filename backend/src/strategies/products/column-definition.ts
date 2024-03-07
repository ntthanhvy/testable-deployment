import { Product, ProductVariant } from "@medusajs/medusa";
import {
	CsvSchema,
	CsvSchemaColumn,
} from "@medusajs/medusa/dist/interfaces/csv-parser";
import {
	ProductColumnDefinition,
	TBuiltProductImportLine,
	TParsedProductImportRowData,
} from "@medusajs/medusa/dist/strategies/batch-jobs/product/types";

export type ProductVariantWithCustomFields = ProductVariant & {
	size: string;
	shape: string;
	nutritic_code: string;
	meta_title: string;
	meta_description: string;
	character_limit: number;
};

export type ProductWithCustomFields = Product & {
	personalized_message: boolean;
};

export const productVariantCustomColumnsDefinition: ProductColumnDefinition = {
	"Product Shape": {
		name: "Product Shape",
		importDescriptor: {
			mapTo: "variant.shape",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.shape ?? "";
			},
			entityName: "variant",
		},
	},
	"Personalised message": {
		name: "Personalised message",
		importDescriptor: {
			mapTo: "product.personalized_message",
		},
		exportDescriptor: {
			accessor: (product: ProductWithCustomFields) => {
				return product.personalized_message ? "TRUE" : "FALSE";
			},
			entityName: "product",
		},
	},
	"Character limit": {
		name: "Character limit",
		importDescriptor: {
			mapTo: "variant.character_limit",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return (variant.character_limit ?? 25).toString();
			},
			entityName: "variant",
		},
	},
	"Image upload": {
		name: "Image upload",
		importDescriptor: {
			mapTo: "variant.image_upload",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.size ?? "";
			},
			entityName: "variant",
		},
	},
	"Nutritic Code": {
		name: "Nutritic Code",
		importDescriptor: {
			mapTo: "variant.nutritic_code",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.nutritic_code ?? "";
			},
			entityName: "variant",
		},
	},
	"Meta Title": {
		name: "Meta Title",
		importDescriptor: {
			mapTo: "variant.meta_title",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.meta_title ?? "";
			},
			entityName: "variant",
		},
	},
	"Meta Description": {
		name: "Meta Description",
		importDescriptor: {
			mapTo: "variant.meta_description",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.meta_description ?? "";
			},
			entityName: "variant",
		},
	},
	"Tax Class Name": {
		name: "Tax Class Name",
		importDescriptor: {
			mapTo: "variant.tax_class.name",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.meta_description ?? "";
			},
			entityName: "variant",
		},
	},
	"Lead time": {
		name: "Lead time",
		importDescriptor: {
			mapTo: "variant.lead_time",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.meta_description ?? "";
			},
			entityName: "variant",
		},
	},
	"Meta Keywords": {
		name: "Meta Keywords",
		importDescriptor: {
			mapTo: "variant.size",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.size ?? "";
			},
			entityName: "variant",
		},
	},
	Stock: {
		name: "Stock",
		importDescriptor: {
			mapTo: "variant.stock",
		},
		exportDescriptor: {
			accessor: (variant: ProductVariantWithCustomFields) => {
				return variant.size ?? "";
			},
			entityName: "variant",
		},
	},
};

export const productVariantCustomImportColumnsDefinition: CsvSchema<
	TParsedProductImportRowData,
	TBuiltProductImportLine
> = {
	columns: Object.entries(productVariantCustomColumnsDefinition)
		.map(([name, def]) => {
			return def.importDescriptor && { name, ...def.importDescriptor };
		})
		.filter(
			(
				v
			): v is CsvSchemaColumn<
				TParsedProductImportRowData,
				TBuiltProductImportLine
			> => {
				return !!v;
			}
		),
};
