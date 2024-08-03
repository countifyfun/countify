// This is for the CI `Typecheck` step

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "@/.map.ts" {
  export const map: string;
}
