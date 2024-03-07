import { Route, Routes } from "react-router-dom";
import Index from "./pages";

export default function StockLocationPage() {
	return (
		<Routes>
			<Route index element={<Index />} />
		</Routes>
	);
}
