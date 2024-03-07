import KlevuService from "src/services/klevu";

export default async function (container) {
	console.log("hello world");

	const klevuService: KlevuService = container.resolve("klevuService");
}
