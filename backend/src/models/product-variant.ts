import { ProductVariant as MedusaProductVariant } from "@medusajs/medusa";
import { Column, Entity } from "typeorm";

@Entity()
export class ProductVariant extends MedusaProductVariant {
	@Column({ nullable: true })
	size: string;

	@Column({ nullable: true })
	shape: string;

	@Column({ nullable: true })
	nutritic_code: string;

	@Column({ nullable: true })
	meta_title: string;

	@Column("text", { nullable: true })
	meta_description: string;

	@Column({ nullable: true, default: 25 })
	character_limit: number;

	@Column({ default: false })
	image_upload: boolean;

	@Column({ nullable: true })
	meta_keywords: string;
}

export default ProductVariant;
