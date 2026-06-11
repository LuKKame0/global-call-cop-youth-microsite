import { ZCopPageContent } from "@/components/localized/z-cop-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.zCop.metaTitle,
    description: dictionary.zCop.metaDescription,
  }));
}

export default function ZCopPage() {
  return <ZCopPageContent />;
}
