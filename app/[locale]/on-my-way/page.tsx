import { OnMyWayPageContent } from "@/components/localized/on-my-way-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.onMyWay.metaTitle,
    description: dictionary.onMyWay.metaDescription,
  }));
}

export default function OnMyWayPage() {
  return <OnMyWayPageContent />;
}
