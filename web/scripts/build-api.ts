import { generateFiles } from "fumadocs-openapi";
import { writeFile } from "fs/promises";
import { restRouter } from "@countify/api/src/rest";
import { rimraf } from "rimraf";
import { stringify } from "yaml";

async function main() {
  await rimraf("./content/docs/api", {
    filter(v) {
      return !v.endsWith("index.mdx") && !v.endsWith("meta.json");
    },
  });

  await writeFile(
    "api.yaml",
    stringify(
      restRouter.getOpenAPIDocument({
        openapi: "3.0.0",
        info: {
          title: "Countify API",
          version: "3.0.0",
        },
        servers: [
          {
            url: "https://api.countify.fun",
          },
        ],
      })
    )
  );

  await generateFiles({
    input: "api.yaml",
    output: "./content/docs/api",
    per: "operation",
  });

  process.exit(0);
}

main();
