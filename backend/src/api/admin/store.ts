import {
	AdminPostStoreReq as MedusaAdminPostStoreReq,
	registerOverriddenValidators,
} from "@medusajs/medusa";
import { IsOptional } from "class-validator";

class AdminPostStoreReq extends MedusaAdminPostStoreReq {
	@IsOptional()
	banner_image?: string;

	@IsOptional()
	favicon?: string;

	@IsOptional()
	logo?: string;

	@IsOptional()
	site_name?: string;
}

registerOverriddenValidators(AdminPostStoreReq);

export { AdminPostStoreReq };
