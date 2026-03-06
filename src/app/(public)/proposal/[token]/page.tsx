import { ProposalResponse } from "@/components/public-site/ProposalResponse";

export const metadata = {
  title: "Your Proposal - BuiltByBas",
  robots: "noindex, nofollow",
};

export default async function ProposalResponsePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ProposalResponse token={token} />;
}
