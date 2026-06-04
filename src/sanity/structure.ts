import type { StructureResolver } from "sanity/structure";
import { CogIcon, PlayIcon, CalendarIcon, BasketIcon } from "@sanity/icons";

// Singleton "Innstillinger" + lists for the document types.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innhold")
    .items([
      S.listItem()
        .title("Innstillinger")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("release").title("Utgivelser").icon(PlayIcon),
      S.documentTypeListItem("show").title("Konserter").icon(CalendarIcon),
      S.documentTypeListItem("product").title("Produkter").icon(BasketIcon),
    ]);
