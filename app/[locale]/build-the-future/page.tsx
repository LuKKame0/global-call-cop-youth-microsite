import { BuildTheFuturePageContent } from "@/components/localized/build-the-future-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.buildTheFuture.metaTitle,
    description: dictionary.buildTheFuture.metaDescription,
  }));
}

export default function BuildTheFuturePage() {
  return <BuildTheFuturePageContent />;
}
