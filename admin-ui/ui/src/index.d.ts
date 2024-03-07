import { Store as MedusaStore, SoftDeletableEntity } from "@medusajs/medusa";

declare const __BASE__: string | undefined;

declare module "@medusajs/medusa" {
	export class ProductCollection extends SoftDeletableEntity {
		title: string;
		handle: string;
		products: Product[];
		metadata: Record<string, unknown>;
		/**
		 * @apiIgnore
		 */
		private createHandleIfNotProvided;

		thumbnail?: string;
	}

	export interface AdminPostCollectionsCollectionReq {
		thumbnail?: string;
	}

	export interface AdminPostCollectionsReq {
		thumbnail?: string;
	}

	export interface Store extends MedusaStore {
		banner_image: string | null;
		logo: string | null;
		favicon: string | null;
		site_name: string | null;
	}
}
