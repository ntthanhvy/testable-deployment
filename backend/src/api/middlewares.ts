import { MiddlewaresConfig, transformStoreQuery } from "@medusajs/medusa";
import multer from "multer";

import { urlencoded } from "body-parser";
import { StoreGetStoreLocationsParams } from "./store/store-locations/route";

const array_of_allowed_file_types = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/gif",
];

const upload = multer({
	dest: "uploads/",
	fileFilter: (req, file, cb) => {
		if (!array_of_allowed_file_types.includes(file.mimetype)) {
			return cb(new Error("Only images are allowed"));
		}

		cb(null, true);
	},
});

export const config: MiddlewaresConfig = {
	routes: [
		{
			matcher: "/store/*",
			middlewares: [upload.array("files"), urlencoded({ extended: true })],
		},
		{
			matcher: "/store/store-locations",
			method: ["GET"],
			middlewares: [
				transformStoreQuery(StoreGetStoreLocationsParams, { isList: true }),
			],
		},
	],
};
