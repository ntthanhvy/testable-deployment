export declare module "@medusajs/medusa/dist/models/product-variant" {
	declare interface ProductVariant {
		size?: string;
		shape?: string;
		nutritic_code?: string;
		meta_title?: string;
		meta_description?: string;
		character_limit?: number;
	}

	declare interface Product {
		personalized_message?: boolean;
	}
}

export declare module "@medusajs/medusa/dist/models/product-collection" {
	declare interface ProductCollection {
		thumbnail?: string;
	}
}

export declare module "@medusajs/medusa/dist/models/line-item" {
	declare interface LineItem {
		personal_message?: string;
		image?: string;
	}
}

export declare module "@medusajs/medusa/dist/models/cart" {
	declare interface Cart {
		deliver_at?: Date;
	}
}

declare module "@medusajs/medusa/dist/models/order" {
	interface Order {
		deliver_at?: Date;
	}
}

export declare module "@medusajs/medusa/dist/models/store" {
	declare interface Store {
		banner_image?: string;
		favicon?: string;
		logo?: string;
		site_name?: string;
	}
}
