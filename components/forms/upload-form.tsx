"use client"

import { useForm } from "react-hook-form";
import { Input } from "@/ui/input";
import { useScopedI18n } from "@/locales/client";
import { useToast } from "@/lib/hooks/ui/use-toast";
import { Button } from "@/ui/button";
import { createSongSchema } from "@/lib/schemas/song/create-song";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/ui/form";
import useCreateSong from "@/lib/hooks/actions/song/use-create-song";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

type uploadSchema = z.infer<typeof createSongSchema>

export const UploadForm = () => {
  const { toast } = useToast()
  const { uploadSong, isLoading } = useCreateSong();
  const uploadModalLocale = useScopedI18n('main-service.main-part.config')
  const imageRef = useRef<HTMLInputElement | null>(null);
  const songRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<uploadSchema>({
    resolver: zodResolver(createSongSchema),
    defaultValues: {
      author: "",
      title: "",
      album: "",
      genre: "",
      image: null,
      song: null
    }
  });

  const onSubmit = async (values: uploadSchema) => {
    try {
      if (!values.song || !values.image) {
        toast({
          title: "Что-то не так"
        })
        return null;
      }

      if (!imageRef.current) {
        toast({
          title: "Выберите файл обложки"
        });
        return;
      }

      if (!songRef.current) {
        toast({
          title: "Выберите аудиофайл"
        });
        return;
      }

      const songFile = songRef.current.files ? songRef.current.files[0] : null;
      const imageFile = imageRef.current.files ? imageRef.current.files[0] : null;

      if (values.song && values.image) {
        uploadSong.mutateAsync({
          title: values.title,
          author: values.author,
          song: songFile,
          image: imageFile,
          album: values.album,
          genre: values.genre
        });
      }
    } catch (error) {
      toast({
        title: "Что-то пошло не так в upload-form " + String(error)
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {uploadModalLocale('song-attributes.song-author')}
              </FormLabel>
              <FormControl>
                <Input
                  autoCorrect="false"
                  autoComplete="false"
                  spellCheck="false"
                  placeholder={uploadModalLocale('placeholder.fields.example') + ' Sidewalks and Skeletons'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {uploadModalLocale('song-attributes.song-name')}
              </FormLabel>
              <FormControl>
                <Input
                  autoCorrect="false"
                  autoComplete="false"
                  spellCheck="false"
                  placeholder={uploadModalLocale('placeholder.fields.example') + ' Awakening'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="album"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Альбом (опционально)
              </FormLabel>
              <FormControl>
                <Input
                  autoCorrect="false"
                  autoComplete="false"
                  spellCheck="false"
                  placeholder="ex. Avatar Album"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Жанр
              </FormLabel>
              <FormControl>
                <Input
                  autoCorrect="false"
                  autoComplete="false"
                  spellCheck="false"
                  placeholder="ex. Phonk"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="song"
          render={({ field: { ref, ...field } }) => (
            <FormItem>
              <FormLabel>
                {uploadModalLocale('song-attributes.song-file')} (mp3)
              </FormLabel>
              <FormControl>
                <Input
                  accept=".mp3"
                  type="file"
                  ref={songRef}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { ref, ...field } }) => (
            <FormItem>
              <FormLabel>
                {uploadModalLocale('song-attributes.song-image')} (webp, jpeg, jpg, png)
              </FormLabel>
              <FormControl>
                <Input
                  accept="image/*"
                  type="file"
                  ref={imageRef}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-black/80 rounded-lg py-2 hover:bg-black/60 hover:duration-200 duration-200 text-[1.3rem] font-semibold"
          disabled={!isLoading}
          type="submit"
        >
          {uploadModalLocale('modal.submit')}
        </Button>
      </form>
    </Form>
  )
}