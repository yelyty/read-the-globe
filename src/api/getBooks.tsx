import { supabase } from "../utils/supabase";

async function getBooks() {
  const { data: books } = await supabase.from("books").select();

  return books;
}
export default getBooks;
