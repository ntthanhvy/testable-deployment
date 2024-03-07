import { Cart as MedusaCart, resolveDbType } from "@medusajs/medusa";
import { Column, Entity, Index } from "typeorm";

@Entity()
export class Cart extends MedusaCart {
	@Column({ nullable: true, type: resolveDbType("timestamptz") })
  @Index()
	deliver_at: Date;
}

export default Cart;
