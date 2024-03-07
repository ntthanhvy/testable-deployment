import {
	OrderService,
	SubscriberArgs,
	SubscriberConfig,
} from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";

export default async function orderDeliverTimeUpdate({
	data,
	eventName,
	container,
}: SubscriberArgs<Record<string, any>>) {
	const orderService: OrderService = container.resolve("orderService");

	const order_id = data.id as string;

	const order = await orderService.retrieve(order_id, {
		relations: ["cart"],
	});

	if (!order) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			`Order with id: ${order_id} was not found`
		);
	}

	// console.log(order);

	if ((order as any).deliver_at === null && order.cart) {
		await orderService.update(order_id, {
			deliver_at: (order.cart as any).deliver_at,
		} as any);
	}
}

export const config: SubscriberConfig = {
	event: OrderService.Events.PLACED,
	context: {
		subscriberId: "order-deliver-time-update",
	},
};
