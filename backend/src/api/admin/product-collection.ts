import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostCollectionsReq as MedusaAdminPostCollectionsReq } from "@medusajs/medusa/dist/api/routes/admin/collections/create-collection";
import { AdminPostCollectionsCollectionReq as MedusaAdminPostCollectionsCollectionReq } from "@medusajs/medusa/dist/api/routes/admin/collections/update-collection";

import { IsOptional } from "class-validator";

class AdminPostCollectionsReq extends MedusaAdminPostCollectionsReq {
	@IsOptional()
	thumbnail?: string;
}

registerOverriddenValidators(AdminPostCollectionsReq);

class AdminPostCollectionsCollectionReq extends MedusaAdminPostCollectionsCollectionReq {
	@IsOptional()
	thumbnail?: string;
}

registerOverriddenValidators(AdminPostCollectionsCollectionReq);

export { AdminPostCollectionsReq, AdminPostCollectionsCollectionReq };