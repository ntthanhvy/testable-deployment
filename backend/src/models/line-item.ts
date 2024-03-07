import { LineItem as MedusaLineItem } from "@medusajs/medusa";
import { Column, Entity } from "typeorm";

@Entity()
export class LineItem extends MedusaLineItem {
	@Column()
	personal_message: string;

	@Column()
	image: string;
}

export default LineItem;
