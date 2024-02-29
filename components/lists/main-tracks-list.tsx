"use client"

import { useScopedI18n } from "@/locales/client";
import { SongItem } from "../song/main/song-item";
import { getSongsAll } from "@/lib/queries/get-songs";
import { createClient } from "@/lib/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { SongEntity } from "@/types/entities/song";

const supabase = createClient();

export const MainTracksList = () => {
  const { data: songs } = useQuery<SongEntity[]>(getSongsAll(supabase), {
    retry: false
  })
  
  const mainSongContentLocale = useScopedI18n('main-service.pages.main-content')

  if (!songs) {
    return (
      <div className="mt-4 text-neutral-400">
        {mainSongContentLocale('navbar.no-available-tracks')}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 py-4 px-4">
      {songs!.map((item) => (
        <SongItem
          key={item.id}
          data={item}
        />
      ))}
    </div>
  )
}