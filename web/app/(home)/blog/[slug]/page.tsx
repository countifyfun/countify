import { blog } from "@/lib/source";
import Image from "next/image";
import { notFound } from "next/navigation";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const page = blog.getPage([params.slug]);
  if (!page) return notFound();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[90rem] flex-col p-6">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">
          {page.data.title}
        </h1>
        <time
          dateTime={new Date(page.data.date).toLocaleString()}
          className="text-sm text-muted-foreground [text-wrap:pretty]"
        >
          {new Date(page.data.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <div className="flex items-center gap-2">
          {page.data.authors.map((author) => (
            <a
              key={author.name}
              href={`https://github.com/${author.githubUsername}`}
              target="_blank"
              className="flex gap-2 text-left"
            >
              <Image
                src={author.avatar}
                alt={author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="text-lg font-bold">{author.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{author.githubUsername}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="prose mx-auto w-full max-w-3xl py-6 text-left">
        <page.data.exports.default />
      </div>
    </div>
  );
}
