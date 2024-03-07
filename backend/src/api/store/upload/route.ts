import { IFileService, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import * as fs from "fs";
import { isArray } from "lodash";

type Request = MedusaRequest & { files: any[] | { files: any[] } };

export const POST = async (req: Request, res: MedusaResponse) => {
	const fileService: IFileService = req.scope.resolve("fileService");

	console.log(req);
	const files = isArray(req.files) ? req.files : req.files["files"];

	const result = await Promise.all(
		files.map(async (f) => {
			return fileService.upload(f).then((result) => {
				fs.unlinkSync(f.path);
				return result;
			});
		})
	);

	res.status(200).json({ uploads: result });
};
