import { map } from "@/.map";
import { loader } from "fumadocs-core/source";
import { createMDXSource, defaultSchemas } from "fumadocs-mdx";
import { z } from "zod";
import { attachFile } from "fumadocs-openapi/source";
import { icons } from "lucide-react";
import { create } from "./icon";

export const docs = loader({
  baseUrl: "/docs",
  rootDir: "docs",
  icon(icon) {
    if (icon && icon in icons)
      return create({ icon: icons[icon as keyof typeof icons] });
  },
  source: createMDXSource(map, {
    schema: {
      frontmatter: defaultSchemas.frontmatter.extend({
        preview: z.string().optional(),
        index: z.boolean().default(false),
        /**
         * API routes only
         */
        method: z.string().optional(),
      }),
    },
  }),
  pageTree: {
    attachFile,
  },
});

export const blog = loader({
  baseUrl: "/blog",
  rootDir: "blog",
  source: createMDXSource(map, {
    schema: {
      frontmatter: defaultSchemas.frontmatter.extend({
        authors: z.array(
          z.object({
            name: z.string(),
            avatar: z.string().url(),
            githubUsername: z.string(),
          })
        ),
        date: z.string().date().or(z.date()),
      }),
    },
  }),
});
