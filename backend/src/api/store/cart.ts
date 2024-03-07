import { StorePostCartsCartLineItemsReq as MedusaStorePostCartsCartLineItemsReq } from "@medusajs/medusa/dist/api/routes/store/carts/create-line-item/index";
import { StorePostCartsCartReq as MedusaStorePostCartsCartReq } from "@medusajs/medusa/dist/api/routes/store/carts/update-cart";
import { StorePostCartsCartLineItemsItemReq as MedusaStorePostCartsCartLineItemsItemReq } from "@medusajs/medusa/dist/api/routes/store/carts/update-line-item";

import { registerOverriddenValidators } from "@medusajs/medusa";

import { IsOptional } from "class-validator";

class StorePostCartsCartLineItemsItemReq extends MedusaStorePostCartsCartLineItemsItemReq {
	@IsOptional()
	personal_message?: string;

	@IsOptional()
	image?: string;
}

class StorePostCartsCartLineItemsReq extends MedusaStorePostCartsCartLineItemsReq {
	@IsOptional()
	personal_message?: string;

	@IsOptional()
	image?: string;
}

registerOverriddenValidators(StorePostCartsCartLineItemsItemReq);
registerOverriddenValidators(StorePostCartsCartLineItemsReq);

class StorePostCartsCartReq extends MedusaStorePostCartsCartReq {
	@IsOptional()
	deliver_at?: string;
}

registerOverriddenValidators(StorePostCartsCartReq);

export {
	StorePostCartsCartLineItemsItemReq,
	StorePostCartsCartLineItemsReq,
	StorePostCartsCartReq,
};
