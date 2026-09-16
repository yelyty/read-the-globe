import { useEffect, useRef, useState } from "react";

const canAnimate = () => {
	return (
		"IntersectionObserver" in window &&
		!window.matchMedia("(prefers-reduced-motion:reduce)").matches
	);
};

/**
 * Reveals an element once a quater of it is in view.
 * If reduced motion or without IntersectionObserver the element starts revealed.
 */
export function useReveal<T extends Element>() {
	const ref = useRef<T>(null);
	const [revealed, setRevealed] = useState(() => !canAnimate());

	useEffect(() => {
		const element = ref.current;
		if (revealed || !element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setRevealed(true);
					observer.disconnect();
				}
			},
			{
				threshold: 0.25,
			},
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, [revealed]);

	return [ref, revealed] as const;
}
