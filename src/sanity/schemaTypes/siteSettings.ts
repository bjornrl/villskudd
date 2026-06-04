import { defineType, defineField, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Innstillinger",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "streaming", title: "Strømming" },
    { name: "contact", title: "Kontakt" },
    { name: "labels", title: "Overskrifter & meny" },
  ],
  fields: [
    defineField({
      name: "bandName",
      title: "Bandnavn (stor tittel)",
      type: "string",
      group: "hero",
      initialValue: "Villskudd",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Forsidebilde",
      type: "image",
      options: { hotspot: true },
      description:
        "Bildet på forsiden. Hvis tomt brukes coveret til nyeste utgivelse.",
      group: "hero",
    }),
    defineField({
      name: "albumCover",
      title: "Album cover",
      type: "image",
      options: { hotspot: true },
      description:
        "Kvadratisk cover som vises over strømmeknappene. Hvis tomt brukes forsidebildet / nyeste utgivelse.",
      group: "hero",
    }),
    defineField({
      name: "heroTagline",
      title: "Hero-undertittel",
      type: "string",
      description: 'Liten tekst under bandnavnet, f.eks. "Et band".',
      group: "hero",
      initialValue: "Et band",
    }),
    defineField({
      name: "listenHeading",
      title: 'Overskrift over strømmeknappene',
      type: "string",
      group: "hero",
      initialValue: "Hør på musikken",
    }),
    defineField({
      name: "streaming",
      title: "Strømmetjenester",
      type: "object",
      group: "streaming",
      description: "Lenker til bandet på de ulike tjenestene.",
      fields: [
        defineField({ name: "spotify", title: "Spotify", type: "url" }),
        defineField({ name: "appleMusic", title: "Apple Music", type: "url" }),
        defineField({ name: "tidal", title: "Tidal", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),
    defineField({
      name: "contactIntro",
      title: "Kontakt-ingress",
      type: "text",
      rows: 2,
      group: "contact",
      initialValue: "Booking, presse eller bare en hilsen — ta kontakt.",
    }),
    defineField({
      name: "contactItems",
      title: "Kontaktinfo",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Etikett",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Verdi (vises)",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Lenke (mailto:/tel:/https:)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Sosiale medier",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Navn",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Lenke",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "showsHeading",
      title: "Overskrift – konserter",
      type: "string",
      group: "labels",
      initialValue: "Kommende konserter",
    }),
    defineField({
      name: "shopHeading",
      title: "Overskrift – shop",
      type: "string",
      group: "labels",
      initialValue: "Shop",
    }),
    defineField({
      name: "shopMailLabel",
      title: "Tekst over kjøpsknappen",
      type: "string",
      group: "labels",
      initialValue: "Send en mail til",
    }),
    defineField({
      name: "contactHeading",
      title: "Overskrift – kontakt",
      type: "string",
      group: "labels",
      initialValue: "Kontakt",
    }),
    defineField({
      name: "enterLabel",
      title: "Knapp på lasteskjerm",
      type: "string",
      group: "labels",
      initialValue: "Trykk da",
    }),
    defineField({
      name: "navLabels",
      title: "Meny-etiketter",
      type: "object",
      group: "labels",
      description: "Tekstene i menyen (lenkene scroller til seksjonene).",
      fields: [
        defineField({ name: "shows", title: "Konserter", type: "string" }),
        defineField({ name: "shop", title: "Shop", type: "string" }),
        defineField({ name: "contact", title: "Kontakt", type: "string" }),
      ],
    }),
    defineField({
      name: "navFooter",
      title: "Meny-bunntekst",
      type: "object",
      group: "labels",
      fields: [
        defineField({ name: "left", title: "Venstre", type: "string" }),
        defineField({ name: "right", title: "Høyre", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Innstillinger" };
    },
  },
});
