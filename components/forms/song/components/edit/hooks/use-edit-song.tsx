import { useUserQuery } from "@/lib/query/user/user-query";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/utils/supabase/client/supabase-client";
import { SongAttributes, SongEntity } from "@/types/song";
import { useUploadSongImage } from "../../create/hooks/use-upload-song-image";
import { SongEditedNotify } from "@/components/notifies/actions/song/song-edited-notify";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { songSchema } from "@/components/forms/song/schemas/schema-song";
import { useSongArtistListQuery } from "@/lib/query/song/song-artist-list-query";
import { zodSongSchema } from "@/components/forms/song/components/create/types/create-form-types";

const supabase = createClient();

type UpdateSongQueryType = {
	userId: string,
	values: SongAttributes
}

async function updateSongQuery({
	userId,
	values
}: UpdateSongQueryType) {
	const { data: updatedSong, error: updatedSongErr } = await supabase
		.from("songs")
		.update({
			user_id: userId,
			title: values.title,
			artists: values.artists,
		})
		.eq("id", values.id)
		.select()

	if (updatedSongErr) throw updatedSongErr;

	return { updatedSong }
}

export function useEditSong(
	song?: SongEntity
) {
	const { toast } = useToast()
	const { data: user } = useUserQuery();
	const { createSongImageMutation } = useUploadSongImage();
	const { data: artistSongId } = useSongArtistListQuery(song?.id)

	const form = useForm<zodSongSchema>({
		resolver: zodResolver(songSchema),
		defaultValues: {
			title: song ? song?.title : "",
			artists: song ? [artistSongId?.firstArtist.id] : [],
		}
	});

	const editSongMutation = useMutation({
		mutationFn: async (
			values: SongAttributes
		) => {
			if (values.image_path && user) {
				try {
					const { updatedSong } = await updateSongQuery({
						userId: user.id,
						values: values
					})

					return updatedSong as SongEntity[]
				} catch (e) {
					throw e;
				}
			}
		},
		onSuccess: async (data) => {
			if (data) {
				toast({
					title: "Трек изменен!",
					variant: "right",
					description: (
						<SongEditedNotify song={data[0]}/>
					),
				})
			}
		},
		onError: () => {
			toast({
				title: "Произошла ошибка при загрузке трека",
				variant: "red"
			})
		}
	});

	return { editSongMutation, form };
}