import { registerOverriddenValidators } from "@medusajs/medusa";
import { StoreGetCollectionsParams as MedusaStoreGetCollectionsParams } from "@medusajs/medusa/dist/api/routes/store/collections/list-collections";
import { IsOptional } from "class-validator";

class StoreGetCollectionsParams extends MedusaStoreGetCollectionsParams {
	@IsOptional()
	homepage?: boolean;

	@IsOptional()
	order?: number;
}

registerOverriddenValidators(StoreGetCollectionsParams);

export { StoreGetCollectionsParams };
