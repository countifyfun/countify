import { type DocsLayoutProps } from "fumadocs-ui/layout";
import { type HomeLayoutProps } from "fumadocs-ui/home-layout";
import { pageTree } from "@/app/source";
import logo from "../public/logo.png";
import Image from "next/image";

// shared configuration
export const baseOptions: HomeLayoutProps = {
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
  ],
};

// docs layout configuration
export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: pageTree,
};
