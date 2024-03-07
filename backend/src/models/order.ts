import { Order as MedusaOrder, resolveDbType } from "@medusajs/medusa";
import { Column, Entity, Index } from "typeorm";

@Entity()
export class Order extends MedusaOrder {
	@Column({ nullable: true, type: resolveDbType("timestamptz") })
  @Index()
	deliver_at: Date;
}

export default Order;
