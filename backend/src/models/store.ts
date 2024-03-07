import { Store as MedusaStore } from "@medusajs/medusa";
import { Column, Entity } from "typeorm";

@Entity()
export class Store extends MedusaStore {
	@Column({ nullable: true })
	banner_image: string;

	@Column({ nullable: true })
	favicon: string;

	@Column({ nullable: true })
	logo: string;

	@Column({ nullable: true })
	site_name: string;
}

export default Store;
