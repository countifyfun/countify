import { type DocsLayoutProps } from "fumadocs-ui/layout";
import { type HomeLayoutProps } from "fumadocs-ui/home-layout";
import { pageTree } from "@/app/source";
import logo from "../public/logo.png";
import Image from "next/image";
import { PlusIcon } from "lucide-react";

// shared configuration
export const baseOptions: HomeLayoutProps = {
  githubUrl: "https://github.com/countifyfun/countify",
  nav: {
    title: (
      <>
        <Image
          src={logo}
          alt="Countify Logo"
          width={24}
          height={24}
          className="rounded-full"
        />
        <span className="font-medium max-md:[header_&]:hidden">Countify</span>
      </>
    ),
  },
  links: [
    {
      text: "Docs",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "Blog",
      url: "/blog",
      active: "nested-url",
    },
    {
      text: (
        <>
          <div className="inline-flex items-center justify-center rounded-md p-1.5 text-sm font-medium !text-white transition-colors duration-100 hover:bg-fd-accent hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50 max-lg:hidden [&_svg]:size-5">
            <PlusIcon />
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <PlusIcon />
            Invite
          </div>
        </>
      ),
      url: "/invite",
      secondary: true,
      external: true,
    },
  ],
};

// docs layout configuration
export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: pageTree,
  links: [
    ...baseOptions.links!.slice(0, -1),
    {
      text: "Invite",
      url: "/invite",
      icon: <PlusIcon />,
      secondary: true,
    },
  ],
};
