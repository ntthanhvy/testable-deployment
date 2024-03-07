import { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import { Badge, Container, Heading, useToggleState } from "@medusajs/ui";
import { useState } from "react";
import { VariantCustomModal } from "../components/VariantCustomModal";

const ProductVariantCustom = ({
	product,
	notify,
}: ProductDetailsWidgetProps) => {
	const { state, toggle, close } = useToggleState(false);
	const [selectedVariant, setSelectedVariant] = useState(null);

	return (
		<>
			<Container title="Variants Images">
				<Heading
					level="h1"
					className="flex items-center justify-between gap-x-4 text-2xl font-semibold"
				>
					<div>Variants Custom</div>
				</Heading>
				{product.variants.map((variant: any) => (
					<div key={variant.id} className="mt-3 w-full">
						<div className="flex items-center">
							<div className="inter-base-semibold flex-1">{variant.title}</div>
							<div className="ml-auto">
								<button
									onClick={() => {
										setSelectedVariant(variant);
										toggle();
									}}
									className="text-sm text-gray-600 hover:text-gray-800"
								>
									Edit
								</button>
							</div>
						</div>
						<div className="w-full flex items-center gap-3">
							<Badge>Size: {variant.size}</Badge>
							<Badge>Shape: {variant.shape}</Badge>
							<Badge>Nutritic Code: {variant.nutritic_code}</Badge>
						</div>
					</div>
				))}
			</Container>

			<VariantCustomModal
				productId={product.id}
				variant={selectedVariant}
				open={state}
				onClose={close}
			/>
		</>
	);
};

// export const config: WidgetConfig = {
// 	zone: "product.details.after",
// };

// export default ProductVariantCustom;
