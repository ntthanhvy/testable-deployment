import { TransactionBaseService } from "@medusajs/medusa";
import { IsNull } from "typeorm";
import Page from "../models/page";

class PageService extends TransactionBaseService {
	async findAll() {
		const pageRepo = this.activeManager_.getRepository(Page);
		return await pageRepo.find({
			where: { deleted_at: IsNull() },
			relations: ["parent"],
			select: [
				"id",
				"title",
				"slug",
				"parent_id",
				"status",
				"created_at",
				"parent",
				"order",
			],
		});
	}

	async findOne(id: string) {
		const pageRepo = this.activeManager_.getRepository(Page);
		return await pageRepo.findOne({
			where: { id, deleted_at: IsNull() },
			relations: ["parent", "children"],
		});
	}

	async create(data: {
		title: string;
		slug: string;
		body: string;
		parent_id: string;
		order?: number | null;
	}) {
		return this.atomicPhase_(async (manager) => {
			const pageRepo = manager.getRepository(Page);
			const page = pageRepo.create();

			page.title = data.title;
			page.slug = data.slug;
			page.body = data.body;
			page.parent_id = data.parent_id;
			page.order = data.order || 0;

			const result = await pageRepo.save(page);

			return result;
		});
	}

	async update(id: string, data: any) {
		return this.atomicPhase_(async (manager) => {
			const pageRepo = manager.getRepository(Page);
			const page = await this.findOne(id);

			if (!page) {
				throw new Error(`Page with id: ${id} not found`);
			}

			if (data.parent_id) {
				const parent = await this.findOne(data.parent_id);
				if (!parent) {
					throw new Error(`Parent with id: ${data.parent_id} not found`);
				}
				page.parent_id = data.parent_id;
			}

			if (data.title) {
				page.title = data.title;
			}

			if (data.slug) {
				page.slug = data.slug;
			}

			if (data.body) {
				page.body = data.body;
			}

			if (data.order) {
				page.order = data.order;
			}

			const result = await pageRepo.save(page);

			return result;
		});
	}

	async delete(id: string) {
		return this.atomicPhase_(async (manager) => {
			const pageRepo = manager.getRepository(Page);
			const page = await this.findOne(id);

			if (!page) {
				throw new Error(`Page with id: ${id} not found`);
			}

			await pageRepo.softDelete(id);

			return {};
		});
	}

	async findBySlug(slug: string) {
		const pageRepo = this.activeManager_.getRepository(Page);
		return await pageRepo.findOne({
			where: { slug, deleted_at: IsNull() },
			relations: ["parent", "children"],
		});
	}
}

export default PageService;
