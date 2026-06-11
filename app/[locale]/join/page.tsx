import { JoinPageContent } from "@/components/localized/join-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.join.metaTitle,
    description: dictionary.join.metaDescription,
  }));
}

export default function JoinPage() {
  return <JoinPageContent />;
}
