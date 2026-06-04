import { type SchemaTypeDefinition } from "sanity";

import { release } from "./release";
import { show } from "./show";
import { product } from "./product";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [release, show, product, siteSettings],
};
