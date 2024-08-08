import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Megaphone, Plus } from "lucide-react";
import Link from "next/link";

export default async function Landing() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[90rem] flex-col p-6">
      <div className="flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col items-center justify-center gap-3 text-center md:items-start md:text-left">
          <Link
            href="/blog/v3-alpha"
            className="flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Megaphone className="h-5 w-5 text-primary" />
            <p>
              3.0 is now in alpha! Learn more{" "}
              <ArrowRight className="inline h-4 w-4" />
            </p>
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-bold tracking-tighter [text-wrap:balance]">
              Meet your{" "}
              <span className="relative whitespace-nowrap bg-gradient-to-b from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                dream counting bot
                <SquigglyLines />
              </span>
              .
            </h1>
            <p className="text-neutral-400 [text-wrap:pretty]">
              Keep your counting channel(s) clean and organized with Countify.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/invite"
              className={buttonVariants({ className: "gap-1", size: "sm" })}
            >
              <Plus className="h-5 w-5" />
              Add Countify
            </a>
          </div>
        </div>
        <div className="flex grow flex-col items-center justify-center text-center perspective-250">
          <div className="relative flex w-64 flex-col gap-3 rounded-lg bg-neutral-100 px-4 py-3 transform-style-3d rotate-x-3 dark:bg-neutral-900 md:-rotate-y-3 lg:w-72 xl:w-80">
            <div className="flex items-center gap-2">
              <p className="text-3xl font-semibold">#</p>
              <p className="text-lg">counting</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 text-center text-xl font-bold text-white">
                T
              </div>
              <div className="text-left">
                <p className="text-xs">Terry</p>
                <p className="text-2xl">997</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-500 text-center text-xl font-bold text-white">
                M
              </div>
              <div className="text-left">
                <p className="text-xs">Mark</p>
                <p className="text-2xl">998</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-400 text-center text-xl font-bold text-white">
                T
              </div>
              <div className="text-left">
                <p className="text-xs">Terry</p>
                <p className="text-2xl">999</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-500 text-center text-xl font-bold text-white">
                M
              </div>
              <div className="text-left">
                <p className="text-xs">Mark</p>
                <p className="text-2xl">1000</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-center text-xl font-bold text-white">
                G
              </div>
              <div className="text-left">
                <p className="text-xs">Gerald</p>
                <p className="text-2xl text-red-500">1000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SquigglyLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 418 42"
      className="absolute left-0 top-2/3 h-[0.48em] w-full fill-yellow-300/60"
      preserveAspectRatio="none"
    >
      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
    </svg>
  );
}
