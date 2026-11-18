/** A row's numeric id from the address (?edit=37, ?next=12). The router reads ?edit=37 as the number 37;
    an older link that quoted it (?edit="37") still counts. Anything else is no id. */
export const searchId = (value: unknown): number | undefined => {
  const id =
    typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

  return typeof id === 'number' && Number.isInteger(id) ? id : undefined;
};
