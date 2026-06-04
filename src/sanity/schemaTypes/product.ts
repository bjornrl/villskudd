import { defineType, defineField } from "sanity";
import { BasketIcon } from "@sanity/icons";

export const product = defineType({
  name: "product",
  title: "Produkt",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      description: 'F.eks. "LP / Vinyl", "Klær", "CD".',
    }),
    defineField({
      name: "price",
      title: "Pris",
      type: "string",
      description: 'F.eks. "399 kr".',
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Kjøpslenke",
      type: "url",
    }),
    defineField({
      name: "buyLabel",
      title: "Knappetekst",
      type: "string",
      initialValue: "Kjøp",
    }),
    defineField({
      name: "order",
      title: "Rekkefølge",
      type: "number",
      description: "Lavere tall vises først.",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Rekkefølge",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "image" },
  },
});
