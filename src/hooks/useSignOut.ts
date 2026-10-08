import { useCallback, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { signOut } from "../auth/session";

export function useSignOut() {
	const router = useRouter();
	const [signingOut, setSigningOut] = useState(false);

	const handleSignOut = useCallback(async () => {
		if (signingOut) return;
		setSigningOut(true);
		try {
			await signOut();
			router.clearCache();
			await router.navigate({ to: "/" });
		} finally {
			setSigningOut(false);
		}
	}, [router, signingOut]);

	return { signOut: handleSignOut, signingOut };
}
