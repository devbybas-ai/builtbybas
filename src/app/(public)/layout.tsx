import { PageBackground } from "@/components/public-site/PageBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageBackground />
      {children}
    </>
  );
}
