import { AdvocacyPageContent } from "@/components/localized/advocacy-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.advocacy?.metaTitle ?? "Advocacy",
    description: dictionary.advocacy?.metaDescription ?? "",
  }));
}

export default function AdvocacyPage() {
  return <AdvocacyPageContent />;
}
