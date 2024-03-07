import {
    ProductService,
    type SubscriberConfig,
    type SubscriberArgs,
    Order,
    OrderService,
} from "@medusajs/medusa"

import { MedusaError } from "medusa-core-utils";

import { json2csv } from 'json-2-csv';
import { Readable } from "stream";

// import { Client } from "ssh2-sftp-client";
let Client = require('ssh2-sftp-client');

export default async function orderConfirmedUploadHandler({
    data, eventName, container, pluginOptions,
}: SubscriberArgs<Record<string, any>>) {
    const loggerId = "order-confirmed-upload-handler";
    const orderService: OrderService = container.resolve("orderService");

    const order_id = data.id as string;

    const order = await orderService.retrieve(order_id, {
        relations: ["cart", "items", "items.variant", "shipping_methods", "shipping_address", "billing_address"],
    });

    if (!order) {
        throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Order with id: ${order_id} was not found`
        );
    }



    // convert order from json to csv
    const newOrder = {
        id: order.id,
        created_at: order.created_at,
        display_id: order.display_id,
        email: order.email,
        currency_code: order.currency_code,
        items: [
            order.items.map((item) => {
                return {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    thumbnail: item.thumbnail,
                    unit_price: item.unit_price,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                }
            })
        ],
        shipping: {
            first_name: order.shipping_address.first_name,
            last_name: order.shipping_address.last_name,
            company: order.shipping_address.company,
            address_1: order.shipping_address.address_1,
            address_2: order.shipping_address.address_2,
            city: order.shipping_address.city,
            postal_code: order.shipping_address.postal_code,
            country: order.shipping_address.country_code,
            phone: order.shipping_address.phone,

        }
    };



    const orderCsv = await json2csv([newOrder], {
        unwindArrays: true,
    });
    console.log(loggerId, order);
    console.log('------------------')
    console.log(loggerId, newOrder);
    console.log('------------------')
    console.log(loggerId, orderCsv);
    console.log('------------------')


    try {
        let sftp = new Client("upload-handler-csv");
        const connectObj = {
            host: process.env.FTP_HOST || "localhost",
            user: process.env.FTP_USER || "user",
            password: process.env.FTP_PASSWORD || "123456",
        };
        await sftp.connect(connectObj);

        var pathFile = `/${process.env.FTP_FOLDER || "Website Orders"}/${order.id}.csv`;
        await sftp.put(Buffer.from(orderCsv), pathFile);
    }
    catch (err) {
        console.log(err)
    }
    // order-confirmed-upload-handler {
    //     object: 'order',
    //     id: 'order_01HM8B7KYHP5W97TB8A9N6RW74',
    //     created_at: 2024-01-16T05:17:16.047Z,
    //     updated_at: 2024-01-16T05:17:16.047Z,
    //     status: 'pending',
    //     fulfillment_status: 'not_fulfilled',
    //     payment_status: 'awaiting',
    //     display_id: 4,
    //     cart_id: 'cart_01HM8B0AE00BG91PHWYCDE6V7Y',
    //     customer_id: 'cus_01HM89595MMQ2MQ32DZKEEYVE0',
    //     email: 'viet.duy.pham@gmail.com',
    //     billing_address_id: 'addr_01HM8B7H71QJGDRWXGBBEX6CGY',
    //     shipping_address_id: 'addr_01HM8B7H713YRRR311YC3FKH3V',
    //     region_id: 'reg_01HGD2BZTTTFMTKQ85VPF2NMW8',
    //     currency_code: 'eur',
    //     tax_rate: null,
    //     draft_order_id: null,
    //     canceled_at: null,
    //     metadata: {},
    //     no_notification: null,
    //     idempotency_key: null,
    //     external_id: null,
    //     sales_channel_id: 'sc_01HGD2AKBEGAZV40MB0WEMCYZA',
    //     deliver_at: null,
    //     beforeInsert: [Function (anonymous)],
    //     cart: Cart {
    //       object: 'cart',
    //       id: 'cart_01HM8B0AE00BG91PHWYCDE6V7Y',
    //       created_at: 2024-01-16T05:13:16.984Z,
    //       updated_at: 2024-01-16T05:17:16.047Z,
    //       deleted_at: null,
    //       email: 'viet.duy.pham@gmail.com',
    //       billing_address_id: 'addr_01HM8B7H71QJGDRWXGBBEX6CGY',
    //       shipping_address_id: 'addr_01HM8B7H713YRRR311YC3FKH3V',
    //       region_id: 'reg_01HGD2BZTTTFMTKQ85VPF2NMW8',
    //       customer_id: 'cus_01HM89595MMQ2MQ32DZKEEYVE0',
    //       payment_id: 'pay_01HM8B7KVQ987YAYCSWVSGVMPQ',
    //       type: 'default',
    //       completed_at: 2024-01-16T05:17:16.130Z,
    //       payment_authorized_at: 2024-01-16T05:17:16.029Z,
    //       idempotency_key: null,
    //       context: {
    //         ip: '::1',
    //         user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    //       },
    //       metadata: null,
    //       sales_channel_id: 'sc_01HGD2AKBEGAZV40MB0WEMCYZA',
    //       deliver_at: 2024-01-16T05:17:08.229Z
    //     },
    //     items: [
    //       LineItem {
    //         id: 'item_01HM8B75XHMKZ49C43FC9E2Q4M',
    //         created_at: 2024-01-16T05:17:01.703Z,
    //         updated_at: 2024-01-16T05:17:16.047Z,
    //         cart_id: 'cart_01HM8B0AE00BG91PHWYCDE6V7Y',
    //         order_id: 'order_01HM8B7KYHP5W97TB8A9N6RW74',
    //         swap_id: null,
    //         claim_order_id: null,
    //         original_item_id: null,
    //         order_edit_id: null,
    //         title: 'Medusa Coffee Mug',
    //         description: 'One Size',
    //         thumbnail: 'https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png',
    //         is_return: false,
    //         is_giftcard: false,
    //         should_merge: true,
    //         allow_discounts: true,
    //         has_shipping: true,
    //         unit_price: 1000,
    //         variant_id: 'variant_01HGD2C0F0XH49221910P1AK8V',
    //         quantity: 1,
    //         fulfilled_quantity: null,
    //         returned_quantity: null,
    //         shipped_quantity: null,
    //         metadata: {},
    //         personal_message: '',
    //         image: null,
    //         variant: [ProductVariant]
    //       }
    //     ],
    //     shipping_methods: [
    //       ShippingMethod {
    //         id: 'sm_01HM8B7HCS0E26ZS5DH1DPQQYW',
    //         shipping_option_id: 'so_01HGD2BZW085T923K0TP4SDKSV',
    //         order_id: 'order_01HM8B7KYHP5W97TB8A9N6RW74',
    //         claim_order_id: null,
    //         cart_id: 'cart_01HM8B0AE00BG91PHWYCDE6V7Y',
    //         swap_id: null,
    //         return_id: null,
    //         price: 1000,
    //         data: {}
    //       }
    //     ]
    //   }
}




export const config: SubscriberConfig = {
    event: OrderService.Events.PLACED,
    context: {
        subscriberId: "order-confirm-upload-handler",
    },
}
