import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostProductsReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-product";
import { AdminPostProductsProductVariantsReq as MedusaAdminPostProductsProductVariantsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-variant";
import { AdminPostProductsProductReq as MedusaAdminPostProductsProductReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-product";
import { AdminPostProductsProductVariantsVariantReq as MedusaAdminPostProductsProductVariantsVariantReq } from "@medusajs/medusa/dist/api/routes/admin/products/update-variant";
import { ProductVariantPricesCreateReq } from "@medusajs/medusa/dist/types/product-variant";

import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

class AdminPostProductsProductVariantsVariantReq extends MedusaAdminPostProductsProductVariantsVariantReq {
	@IsOptional()
	size?: string;

	@IsOptional()
	shape?: string;

	@IsOptional()
	nutritic_code?: string;

	@IsOptional()
	meta_title?: string;

	@IsOptional()
	meta_description?: string;

	@IsOptional()
	character_limit?: number;

	@IsOptional()
	image_upload?: string;

	@IsOptional()
	meta_keywords?: string;
}

registerOverriddenValidators(AdminPostProductsProductVariantsVariantReq);

class AdminPostProductsProductVariantsReq extends MedusaAdminPostProductsProductVariantsReq {
	@IsOptional()
	size?: string;

	@IsOptional()
	shape?: string;

	@IsOptional()
	nutritic_code?: string;

	@IsOptional()
	meta_title?: string;

	@IsOptional()
	meta_description?: string;

	@IsOptional()
	character_limit?: number;

	@IsOptional()
	image_upload?: string;

	@IsOptional()
	meta_keywords?: string;
}

registerOverriddenValidators(AdminPostProductsProductVariantsReq);

class ProductVariantOptionReq {
	@IsString()
	value: string;
}

class ProductVariantReq {
	@IsString()
	title: string;

	@IsString()
	@IsOptional()
	sku?: string;

	@IsString()
	@IsOptional()
	ean?: string;

	@IsString()
	@IsOptional()
	upc?: string;

	@IsString()
	@IsOptional()
	barcode?: string;

	@IsString()
	@IsOptional()
	hs_code?: string;

	@IsNumber()
	@IsOptional()
	inventory_quantity?: number = 0;

	@IsBoolean()
	@IsOptional()
	allow_backorder?: boolean;

	@IsBoolean()
	@IsOptional()
	manage_inventory?: boolean;

	@IsNumber()
	@IsOptional()
	weight?: number;

	@IsNumber()
	@IsOptional()
	length?: number;

	@IsNumber()
	@IsOptional()
	height?: number;

	@IsNumber()
	@IsOptional()
	width?: number;

	@IsString()
	@IsOptional()
	origin_country?: string;

	@IsString()
	@IsOptional()
	mid_code?: string;

	@IsString()
	@IsOptional()
	material?: string;

	@IsObject()
	@IsOptional()
	metadata?: Record<string, unknown>;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ProductVariantPricesCreateReq)
	prices: ProductVariantPricesCreateReq[];

	@IsOptional()
	@Type(() => ProductVariantOptionReq)
	@ValidateNested({ each: true })
	@IsArray()
	options?: ProductVariantOptionReq[] = [];

	@IsOptional()
	@IsString()
	size?: string;

	@IsOptional()
	@IsString()
	shape?: string;

	@IsOptional()
	@IsString()
	nutritic_code?: string;

	@IsOptional()
	@IsString()
	meta_title?: string;

	@IsOptional()
	@IsString()
	meta_description?: string;

	@IsOptional()
	character_limit?: number;

	@IsOptional()
	image_upload?: string;

	@IsOptional()
	meta_keywords?: string;
}

class AdminPostProductsReq extends MedusaAdminPostProductsReq {
	@IsOptional()
	@Type(() => ProductVariantReq)
	@ValidateNested({ each: true })
	@IsArray()
	variants?: ProductVariantReq[];

	@IsOptional()
	@IsBoolean()
	personalized_message?: boolean;
}

registerOverriddenValidators(AdminPostProductsReq);

class AdminPostProductsProductReq extends MedusaAdminPostProductsProductReq {
	@IsOptional()
	@IsBoolean()
	personalized_message?: boolean;
}

registerOverriddenValidators(AdminPostProductsProductReq);

export * from "./admin/order";
export * from "./admin/product-collection";
export * from "./store/cart";
export * from "./admin/store"