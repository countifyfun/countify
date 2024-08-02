import Image from "next/image";

export default function Footer() {
  return (
    <div className="border-t">
      <footer
        className="mx-auto flex max-w-[90rem] justify-center px-6 py-12 text-gray-400 md:justify-start"
        aria-labelledby="footer-heading"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div>
          <a
            className="flex items-center justify-center gap-2 transition-all hover:opacity-75 md:w-fit md:justify-normal"
            href="/"
          >
            <Image
              src="/logo.png"
              alt="Countify Logo"
              width={35}
              height={35}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold tracking-tighter text-yellow-300">
              Countify
            </h1>
          </a>
          <p className="mt-4 text-xs text-neutral-500">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/countifyfun"
              className="text-yellow-300 underline decoration-from-font [text-underline-position:from-font]"
            >
              Countify Labs
            </a>{" "}
            (a subdivision of{" "}
            <a
              href="https://youtube.com/@graphifystatistics"
              className="text-yellow-300 underline decoration-from-font [text-underline-position:from-font]"
            >
              Graphify Studios
            </a>
            ). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
