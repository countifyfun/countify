import type { Metadata } from "next";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { docs } from "@/lib/source";
import { Card, Cards } from "fumadocs-ui/components/card";
import { InferPageType } from "fumadocs-core/source";

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = docs.getPage(params.slug);

  if (page == null) {
    notFound();
  }

  const MDX = page.data.exports.default;

  return (
    <DocsPage toc={page.data.exports.toc} full={page.data.full}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
        {page.data.index ? <Category page={page} /> : null}
      </DocsBody>
    </DocsPage>
  );
}

function Category({
  page,
}: {
  page: InferPageType<typeof docs>;
}): React.ReactElement {
  const filtered = docs
    .getPages()
    .filter(
      (item) =>
        item.file.dirname === page.file.dirname && item.file.name !== "index"
    );

  return (
    <Cards>
      {filtered.map((item) => (
        <Card
          key={item.url}
          title={item.data.title}
          description={item.data.description ?? "No Description"}
          href={item.url}
        />
      ))}
    </Cards>
  );
}

export async function generateStaticParams() {
  return docs.getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = docs.getPage(params.slug);

  if (page == null) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  } satisfies Metadata;
}
