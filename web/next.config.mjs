import createMDX from "fumadocs-mdx/config";

const withMDX = createMDX();

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

export default withMDX(config);
