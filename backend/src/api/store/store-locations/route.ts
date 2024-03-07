import { FindParams, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import StoreLocationService from "../../../services/store-location";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const storeLocationService: StoreLocationService = req.scope.resolve(
		"storeLocationService"
	);

	const validated = req.validatedQuery as StoreGetStoreLocationsParams;
	console.log(validated);

	const stores = await storeLocationService.findAll();
	console.log(stores);

	res.status(200).json({ stores });
};

export class StoreGetStoreLocationsParams extends FindParams {
	/**
	 * {@inheritDoc FindPaginationParams.offset}
	 * @defaultValue 0
	 */
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	offset?: number = 0;

	/**
	 * {@inheritDoc FindPaginationParams.limit}
	 * @defaultValue 100
	 */
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	limit?: number = 100;

	/**
	 * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
	 */
	@IsString()
	@IsOptional()
	order?: string;

	/**
	 * {@inheritDoc FilterableProductProps.q}
	 */
	@IsString()
	@IsOptional()
	q?: string;
}
