const url = "https://rest2.ksearchnet.com/rest/service";

import builder from "xmlbuilder";

async function main() {
	const products = [
		{
			id: "1",
			name: "product 1",
		},
		{
			id: "2",
			name: "product 2",
		},
		{
			id: "3",
			name: "product 3",
		},
	];

	const xml = builder
		.create(
			{
				request: {
					sessionId: {
						"#text": "example-session-id",
					},
					records: {
						record: products.map((product) => ({
							pairs: {
								pair: Object.entries(product).map(([key, value]) => ({
									key,
									value,
								})),
							},
						})),
					},
				},
			},
			{ encoding: "utf-8" }
		)
		.end({ pretty: true });

	console.log(xml);
}

main();
