import { useState, useEffect } from "react";
import { getCountryNames } from "../utils/countryNames";

export function useCountryNames() {
	const [names, setNames] = useState<Record<string, string>>({});
	useEffect(() => {
		getCountryNames().then(setNames);
	}, []);
	return names;
}
