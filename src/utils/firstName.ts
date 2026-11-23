/** the first word of a name, for "Anna's atlas" and the postcard's greeting; '' when there's no name */
export const firstName = (fullName?: string | null) =>
  String(fullName ?? '')
    .trim()
    .split(/\s+/)[0];
