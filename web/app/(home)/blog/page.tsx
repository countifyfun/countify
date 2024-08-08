import { blog } from "@/lib/source";
import Link from "next/link";

export default function Blog() {
  const posts = [...blog.getPages()].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[90rem] flex-col gap-3 p-6">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-5xl font-bold tracking-tighter">Blog</h1>
        <p className="text-muted-foreground [text-wrap:pretty]">
          Keep up with the latest Countify news and updates.
        </p>
      </div>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-2">
        {posts.map((post) => (
          <Link
            key={post.slugs[0]}
            href={post.url}
            className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <time
              dateTime={new Date(post.data.date).toLocaleString()}
              className="text-xs text-muted-foreground"
            >
              {new Date(post.data.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">{post.data.title}</h2>
              <p className="text-sm text-muted-foreground [text-wrap:pretty]">
                {post.data.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
