import { ProductCollection as MedusaProductCollection } from "@medusajs/medusa";
import { Column, Entity } from "typeorm";

@Entity()
export class ProductCollection extends MedusaProductCollection {
	@Column({ nullable: true })
	thumbnail: string;
}

export default ProductCollection;
