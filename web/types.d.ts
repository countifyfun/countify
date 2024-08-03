// This is for the CI `Typecheck` step

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "@/.map" {
  export const map: Record<string, unknown>;
}
