// a large prime keeps the hashed ids within a safe integer
const ID_MODULUS = 1_000_000_007;
const ID_SEED = 7;
const ID_MULTIPLIER = 31;

/** Tests name their books by label ('b1', 'Kokoro'); the database's ids are numbers. This turns a label into the
    same number every time, so a book and its places agree on it. */
export const idFor = (label: string) =>
  [...label].reduce(
    (hash, char) => (hash * ID_MULTIPLIER + char.charCodeAt(0)) % ID_MODULUS,
    ID_SEED
  );
