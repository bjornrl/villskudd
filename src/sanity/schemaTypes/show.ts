import { defineType, defineField } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const show = defineType({
  name: "show",
  title: "Konsert",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "date",
      title: "Dato",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Spillested",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "By",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ticketUrl",
      title: "Billettlenke",
      type: "url",
    }),
    defineField({
      name: "ticketLabel",
      title: "Knappetekst",
      type: "string",
      initialValue: "Billetter",
    }),
  ],
  orderings: [
    {
      title: "Dato (først kommende)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "venue", subtitle: "city", date: "date" },
    prepare({ title, subtitle, date }) {
      const formatted = date
        ? new Date(date).toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "";
      return {
        title: title,
        subtitle: [formatted, subtitle].filter(Boolean).join(" · "),
      };
    },
  },
});
