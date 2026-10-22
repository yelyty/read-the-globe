export const isEmail = (value: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

export const passwordStrength = (password: string): 0 | 1 | 2 | 3 | 4 => {
	if (password.length < 8) return 0;
	let score = 1;
	if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
	if (/\d/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;
	return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
};