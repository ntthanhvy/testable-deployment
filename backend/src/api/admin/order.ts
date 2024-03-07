import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostDraftOrdersReq as MedusaAdminPostDraftOrdersReq } from "@medusajs/medusa/dist/api/routes/admin/draft-orders/create-draft-order";
import { AdminPostDraftOrdersDraftOrderLineItemsReq as MedusaAdminPostDraftOrdersDraftOrderLineItemsReq } from "@medusajs/medusa/dist/api/routes/admin/draft-orders/create-line-item";
import { AdminPostOrdersOrderReq as MedusaAdminPostOrdersOrderReq } from "@medusajs/medusa/dist/api/routes/admin/orders/update-order";

import { IsOptional } from "class-validator";

class AdminPostOrdersOrderReq extends MedusaAdminPostOrdersOrderReq {
	@IsOptional()
	deliver_at?: string;
}

registerOverriddenValidators(AdminPostOrdersOrderReq);

class AdminPostDraftOrdersReq extends MedusaAdminPostDraftOrdersReq {
	@IsOptional()
	deliver_at?: string;
}

registerOverriddenValidators(AdminPostDraftOrdersReq);

class AdminPostDraftOrdersDraftOrderLineItemsReq extends MedusaAdminPostDraftOrdersDraftOrderLineItemsReq {
	@IsOptional()
	personal_message?: string;

	@IsOptional()
	image?: string;
}

registerOverriddenValidators(AdminPostDraftOrdersDraftOrderLineItemsReq);

export { AdminPostDraftOrdersReq, AdminPostOrdersOrderReq };
