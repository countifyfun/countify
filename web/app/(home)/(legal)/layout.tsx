import { withArticle as WithArticle } from "fumadocs-ui/page";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto w-full max-w-3xl">
        <WithArticle>{children}</WithArticle>
      </div>
    </>
  );
}
