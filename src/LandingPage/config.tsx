export const bullets = [
  "Pin where each book is set",
  "Mark each author's home country to read across nationalities and perspectives.",
  "Set reading goals: by region, country, place or theme.",
];

export const steps = [
  {
    n: "1",
    eyebrow: "Step one",
    title: "Log the book",
    text: "Jot the title, the author, and the places its story moves through — like a postcard from your reading.",
  },
  {
    n: "2",
    eyebrow: "Step two",
    title: "Place it on the map",
    text: "Pin where the story is set, and mark the author's home country — two ways to chart what you read.",
  },
  {
    n: "3",
    eyebrow: "Step three",
    title: "Drop a pin",
    text: "It lands on your atlas and your countries-visited count climbs. Watch the map fill in, book by book.",
  },
];

export const mapPins = [
  { name: "Russia", kind: "author" as const, top: "34%", left: "72%" },
  { name: "Brazil", kind: "set" as const, top: "62%", left: "30%" },
  { name: "Botswana", kind: "set" as const, top: "70%", left: "51%" },
];

export const goals = [
  { name: "Around South America", done: 3, total: 5 },
  { name: "Island nations", done: 6, total: 8 },
  { name: "Stories set in the Arctic", done: 1, total: 3 },
];
