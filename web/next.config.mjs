import createMDX from "fumadocs-mdx/config";
import { remarkHeading } from "fumadocs-core/mdx-plugins";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/invite",
      destination:
        "https://discord.com/api/oauth2/authorize?client_id=1190299944062570627&permissions=26640&scope=bot%20applications.commands",
      permanent: false,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/embed/avatars/**",
      },
    ],
  },
};

const withMDX = createMDX({
  mdxOptions: {
    remarkPlugins: [remarkHeading],
  },
});

export default withMDX(config);
