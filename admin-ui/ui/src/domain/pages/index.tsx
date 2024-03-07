import { Route, Routes } from "react-router-dom";
import List from "./list";

export default function PagesIndex() {
	return (
		<Routes>
			<Route index element={<List />} />
		</Routes>
	);
}
