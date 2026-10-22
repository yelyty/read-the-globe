export type Errors = { first?: string; second?: string };

export const validate = (first: string, second: string): Errors => {
	if (first.length < 8)
		return {
			first: first
				? "Your new password needs at least 8 characters."
				: "Type a new password.",
		};
	if (second !== first)
		return {
			second: second
				? "The two passwords don’t match. Type the same one twice."
				: "Repeat the new password to confirm it.",
		};
	return {};
};