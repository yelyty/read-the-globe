/* Example content for the landing page */

/* Every plate uses the app's WorldMap projection and scale. */
export const MAP = { width: 800, height: 400, scale: 145 } as const;

/* The plates leave out Antarctica: nobody logs a novel set there, and it only adds a band of land. */
export const ANTARCTICA = "010";

export type Mark = "set" | "author" | "both";

/* Country ids are world-atlas@2 ids (ISO 3166 numeric), the same ids WorldMap uses.
   from: the step a country fills in. bothFrom: the step a later book gives it its second mark. */
export const STORY_MARKS: { id: string; mark: Mark; from: number; bothFrom?: number }[] = [
	{ id: "356", mark: "set", from: 1, bothFrom: 4 }, // India: A Passage to India, later The God of Small Things
	{ id: "826", mark: "author", from: 2 }, // United Kingdom: E. M. Forster
	{ id: "566", mark: "both", from: 3 }, // Nigeria: Things Fall Apart
	{ id: "840", mark: "both", from: 4 }, // United States: The Sympathizer
	{ id: "704", mark: "set", from: 4 }, // Vietnam
	{ id: "380", mark: "set", from: 4 }, // Italy: The English Patient
	{ id: "818", mark: "set", from: 4 }, // Egypt
	{ id: "124", mark: "author", from: 4 }, // Canada: Michael Ondaatje
	{ id: "170", mark: "both", from: 4 }, // Colombia
	{ id: "352", mark: "both", from: 4 }, // Iceland
	{ id: "404", mark: "both", from: 4 }, // Kenya
];

/** countries on the example atlas after each step */
export const STORY_COUNTS = [0, 1, 2, 3, 11];

/* What the camera frames after each step, in map units (x0, y0, x1, y1): the world, India,
   India with the UK (one book's two marks), West Africa, the world. From world-atlas bounds. */
export const STORY_FRAMES: [number, number, number, number][] = [
	[8, 9, 792, 391],
	[521, 77, 623, 199],
	[369, 27, 619, 195],
	[378, 131, 459, 216],
	[8, 9, 792, 391],
];

/** how far past the whole-world view a step may zoom: 1 never zooms, 6 fills the plate with one country */
export const STORY_ZOOM = 2.5;
/** per character while the demo types */
export const STORY_TYPE_MS = 55;
/** how long a result stays on the map before the next step */
export const STORY_DWELL_MS = 3000;

export type DemoBook = { title: string; author: string; country: string; place: string; placeCountry: string };

/* The two books the demo types into the form. */
export const STORY_BOOKS: Record<1 | 3, DemoBook> = {
	1: { title: "A Passage to India", author: "E. M. Forster", country: "United Kingdom", place: "Chandrapore", placeCountry: "India" },
	3: { title: "Things Fall Apart", author: "Chinua Achebe", country: "Nigeria", place: "Umuofia", placeCountry: "Nigeria" },
};

export const STORY_STEPS: { title: string; text: string; log?: string }[] = [
	{
		title: "Log a book.",
		text: "Title, author and the places the story goes. Every place is a pin.",
		log: "A Passage to India by E. M. Forster. Places: Chandrapore, India.",
	},
	{
		title: "Its author leaves a second mark.",
		text: "Olive is where a story is set. Rust is where its author comes from.",
		log: "A Passage to India by E. M. Forster. Author’s country: United Kingdom.",
	},
	{
		title: "Some books stay home.",
		text: "When a story is set where its author is from, the country takes both marks.",
		log: "Things Fall Apart by Chinua Achebe. Both marks: Nigeria.",
	},
	{
		title: "The map is the progress bar.",
		text: "Eight books later, eleven countries have filled in, and goals count along as you go.",
	},
];

export type SpineTone = "green" | "rust" | "cream" | "olive" | "gold";

/* A real shelf: books in runs of a size, one leaning. */
export const SPINES: { title: string; tone: SpineTone; w: number; h: number; lean?: boolean }[] = [
	{ title: "Things Fall Apart", tone: "green", w: 28, h: 150 },
	{ title: "A Passage to India", tone: "cream", w: 28, h: 164 },
	{ title: "The English Patient", tone: "green", w: 30, h: 150 },
	{ title: "One Hundred Years of Solitude", tone: "rust", w: 36, h: 192 },
	{ title: "The God of Small Things", tone: "rust", w: 36, h: 192 },
	{ title: "Independent People", tone: "olive", w: 34, h: 204 },
	{ title: "A Grain of Wheat", tone: "gold", w: 30, h: 160 },
	{ title: "The Sympathizer", tone: "green", w: 30, h: 172, lean: true },
];

export const SHELF_COUNTRIES =
	"Nigeria, India, the United Kingdom, Italy, Egypt, Canada, Colombia, Iceland, Kenya, Vietnam and the United States.";

export const GOALS: { kind: "Region" | "Countries" | "Theme"; name: string; done: number; total: number }[] = [
	{ kind: "Region", name: "Around South America", done: 3, total: 5 },
	{ kind: "Countries", name: "Island nations", done: 6, total: 8 },
	{ kind: "Theme", name: "Stories set in the Arctic", done: 1, total: 3 },
];