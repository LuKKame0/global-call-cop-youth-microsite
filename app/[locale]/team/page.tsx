import { TeamPageContent } from "@/components/localized/team-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.team?.metaTitle ?? "Team",
    description: dictionary.team?.metaDescription ?? "",
  }));
}

export default function TeamPage() {
  return <TeamPageContent />;
}
