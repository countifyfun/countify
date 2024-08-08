import { generateFiles } from "fumadocs-openapi";
import { rm } from "fs/promises";
import { restRouter } from "@countify/api/src/rest";

async function main() {
  await Bun.write(
    "api.json",
    JSON.stringify(
      restRouter.getOpenAPIDocument({
        openapi: "3.0.0",
        info: {
          title: "Countify",
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
    input: ["./api.json"],
    per: "operation",
    output: "./content/docs",
  });

  await rm("api.json");
}

main();
