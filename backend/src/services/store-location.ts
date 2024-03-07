import { Address, TransactionBaseService } from "@medusajs/medusa";
import { IsNull, Like } from "typeorm";
import StoreLocation from "../models/store-location";

class StoreService extends TransactionBaseService {
	async findAll(): Promise<StoreLocation[]> {
		const storeRepo = this.activeManager_.getRepository(StoreLocation);
		return await storeRepo.find({
			where: { deleted_at: IsNull() },
			relations: ["address"],
		});
	}

	async findOne(id: string): Promise<StoreLocation> {
		const storeRepo = this.activeManager_.getRepository(StoreLocation);
		return await storeRepo.findOne({
			where: { id, deleted_at: IsNull() },
			relations: ["address"],
		});
	}

	async create(data: {
		name: string;
		code: string;
		address: any;
		email: string;
	}): Promise<StoreLocation> {
		return this.atomicPhase_(async (manager) => {
			const storeRepo = manager.getRepository(StoreLocation);
			const store = storeRepo.create();

			store.name = data.name;
			store.code = data.code;
			store.email = data.email;

			const addressRepo = manager.getRepository(Address);
			const address = addressRepo.create(data.address) as unknown as Address;
			const addressResult = await addressRepo.save(address);

			console.log(addressResult);

			store.address_id = addressResult.id;

			const result = await storeRepo.save(store);

			return result;
		});
	}

	async update(id: string, data: any): Promise<StoreLocation> {
		return this.atomicPhase_(async (manager) => {
			const storeRepo = manager.getRepository(StoreLocation);
			const store = await this.findOne(id);

			if (!store) {
				throw new Error(`Store with id: ${id} not found`);
			}

			if (data.address) {
				const addressRepo = manager.getRepository(Address);
				const address = await addressRepo.findOne({
					where: { id: store.address_id },
				});

				if (!address) {
					throw new Error(`Address with id: ${store.address_id} not found`);
				}

				const addressResult = await addressRepo.save(
					addressRepo.merge(address, data.address)
				);

				store.address_id = addressResult.id;
			}

			const result = await storeRepo.save(storeRepo.merge(store, data));

			return result;
		});
	}

	async delete(id: string): Promise<{}> {
		return this.atomicPhase_(async (manager) => {
			const storeRepo = manager.getRepository(StoreLocation);
			const store = await this.findOne(id);

			if (!store) {
				throw new Error(`Store with id: ${id} not found`);
			}

			await storeRepo.softDelete(id);

			return {};
		});
	}

	async retrieve(id: string): Promise<StoreLocation> {
		const storeRepo = this.activeManager_.getRepository(StoreLocation);
		const store = await this.findOne(id);
		if (!store) {
			throw new Error(`Store with id: ${id} not found`);
		}

		return store;
	}

	async search(query: { s: string }): Promise<StoreLocation[]> {
		const storeRepo = this.activeManager_.getRepository(StoreLocation);
		const stores = await storeRepo.find({
			where: [
				{ name: Like(`%${query.s}%`), deleted_at: IsNull() },
				{ code: Like(`%${query.s}%`), deleted_at: IsNull() },
			],
			relations: ["address"],
		});

		return stores;
	}
}

export default StoreService;
