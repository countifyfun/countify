import { map } from "@/.map";
import { loader } from "fumadocs-core/source";
import { createMDXSource, defaultSchemas } from "fumadocs-mdx";
import { z } from "zod";

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
