"use server"

import { GenreType } from "@/lib/constants/shared/genres-list";
import { createClient } from "@/lib/utils/supabase/server/supabase-server";

export async function getGenreList(): Promise<GenreType[]> {
	const supabase = await createClient();
	
	const { data, error } = await supabase
		.from("genres")
		.select()
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data
}