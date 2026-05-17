import type { SaveBookState } from "../AddBook";
import { supabase } from "../utils/supabase";

async function saveBook(_prevState: SaveBookState, formData: FormData) {
  const countryCode = formData.get("countryCode") as string;
  console.log(formData);
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;

  const { error } = await supabase.from("books").insert({
    title,
    author,
    countryCode,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export default saveBook;
