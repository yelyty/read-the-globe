import { toNumeric } from '../../../../utils/toIsoNumeric';

// Mira, the example reader of every screenshot and postcard on the landing: her 48 books, oldest first.
// [title, author, author's country, countries the story is set in], as ISO alpha-2 codes.
type MiraBook = [
  title: string,
  author: string,
  authorFrom: string,
  setIn: string[],
];
export const BOOKS: MiraBook[] = [
  ['The Master and Margarita', 'Mikhail Bulgakov', 'ru', ['ru']],
  ['Americanah', 'Chimamanda Ngozi Adichie', 'ng', ['ng', 'us']],
  ['The God of Small Things', 'Arundhati Roy', 'in', ['in']],
  ['Midnight’s Children', 'Salman Rushdie', 'gb', ['in', 'pk']],
  ['The Kite Runner', 'Khaled Hosseini', 'af', ['af']],
  ['My Name Is Red', 'Orhan Pamuk', 'tr', ['tr']],
  ['Palace Walk', 'Naguib Mahfouz', 'eg', ['eg']],
  ['Season of Migration to the North', 'Tayeb Salih', 'sd', ['sd']],
  ['Things Fall Apart', 'Chinua Achebe', 'ng', ['ng']],
  ['A Grain of Wheat', 'Ngũgĩ wa Thiong’o', 'ke', ['ke']],
  ['Disgrace', 'J. M. Coetzee', 'za', ['za']],
  ['So Long a Letter', 'Mariama Bâ', 'sn', ['sn']],
  ['Pedro Páramo', 'Juan Rulfo', 'mx', ['mx']],
  ['Dom Casmurro', 'Machado de Assis', 'br', ['br']],
  ['Ficciones', 'Jorge Luis Borges', 'ar', ['ar']],
  ['The Feast of the Goat', 'Mario Vargas Llosa', 'pe', ['do']],
  ['Snow Country', 'Yasunari Kawabata', 'jp', ['jp']],
  ['The Vegetarian', 'Han Kang', 'kr', ['kr']],
  ['Red Sorghum', 'Mo Yan', 'cn', ['cn']],
  ['The Sympathizer', 'Viet Thanh Nguyen', 'us', ['vn', 'us']],
  ['One Hundred Years of Solitude', 'Gabriel García Márquez', 'co', ['co']],
  ['Austerlitz', 'W. G. Sebald', 'de', ['cz', 'gb']],
  ['By Night in Chile', 'Roberto Bolaño', 'cl', ['cl']],
  ['The Leopard', 'Giuseppe Tomasi di Lampedusa', 'it', ['it']],
  ['The House of the Spirits', 'Isabel Allende', 'cl', ['cl']],
  ['Don Quixote', 'Miguel de Cervantes', 'es', ['es']],
  ['The Old Man and the Sea', 'Ernest Hemingway', 'us', ['cu']],
  ['Madame Bovary', 'Gustave Flaubert', 'fr', ['fr']],
  ['Independent People', 'Halldór Laxness', 'is', ['is']],
  ['Death and the Penguin', 'Andrey Kurkov', 'ua', ['ua']],
  ['Kokoro', 'Natsume Sōseki', 'jp', ['jp']],
  ['The Year of the Hare', 'Arto Paasilinna', 'fi', ['fi']],
  ['Mrs Dalloway', 'Virginia Woolf', 'gb', ['gb']],
  ['Persepolis', 'Marjane Satrapi', 'ir', ['ir']],
  ['The Secret River', 'Kate Grenville', 'au', ['au']],
  ['The Book Thief', 'Markus Zusak', 'au', ['de']],
  ['Anil’s Ghost', 'Michael Ondaatje', 'ca', ['lk']],
  ['Life of Pi', 'Yann Martel', 'ca', ['in']],
  ['The Luminaries', 'Eleanor Catton', 'nz', ['nz']],
  ['The Tin Drum', 'Günter Grass', 'de', ['pl']],
  ['Wide Sargasso Sea', 'Jean Rhys', 'dm', ['jm']],
  ['Sophie’s World', 'Jostein Gaarder', 'no', ['no']],
  ['The Ice Palace', 'Tarjei Vesaas', 'no', ['no']],
  ['Zorba the Greek', 'Nikos Kazantzakis', 'gr', ['gr']],
  ['Kristin Lavransdatter', 'Sigrid Undset', 'no', ['no']],
  ['The Bridge on the Drina', 'Ivo Andrić', 'ba', ['ba']],
  ['The Shadow of the Wind', 'Carlos Ruiz Zafón', 'es', ['es']],
  ['A Fine Balance', 'Rohinton Mistry', 'ca', ['in']],
];

/** Mira's atlas after her first `count` books, as numeric country codes like the map's. */
export const atlasAfter = (count: number) => {
  const set = new Set<string>();
  const author = new Set<string>();

  for (const [, , from, places] of BOOKS.slice(0, count)) {
    author.add(toNumeric(from)!);
    for (const p of places) set.add(toNumeric(p)!);
  }

  return { set, author, countries: new Set([...set, ...author]).size };
};
