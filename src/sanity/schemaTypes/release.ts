import { defineType, defineField } from "sanity";
import { PlayIcon } from "@sanity/icons";

export const release = defineType({
  name: "release",
  title: "Utgivelse",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "album",
      title: "Album / type",
      type: "string",
      description: 'F.eks. "Debutalbum", "Singel", "EP".',
    }),
    defineField({
      name: "year",
      title: "År",
      type: "string",
    }),
    defineField({
      name: "cover",
      title: "Cover / bilde",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Lenke",
      type: "url",
      description: "Lenke til utgivelsen (Spotify, Bandcamp e.l.).",
    }),
    defineField({
      name: "releaseDate",
      title: "Utgivelsesdato",
      type: "datetime",
      description: "Brukes for å vise den nyeste utgivelsen øverst.",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Nyeste først",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "album", media: "cover" },
  },
});
