import { ActivitiesPageContent } from "@/components/localized/activities-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.activities.metaTitle,
    description: dictionary.activities.metaDescription,
  }));
}

export default function ActivitiesPage() {
  return <ActivitiesPageContent />;
}
