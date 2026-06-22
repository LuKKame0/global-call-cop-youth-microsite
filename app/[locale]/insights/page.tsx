import { FrameworkPage } from "@/components/framework-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.insights.metaTitle,
    description: dictionary.insights.metaDescription,
  }));
}

export default function InsightsPage() {
  return <FrameworkPage />;
}
