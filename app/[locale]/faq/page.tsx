import { FaqPage } from "@/components/faq-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.faq.metaTitle,
    description: dictionary.faq.metaDescription,
  }));
}

export default function FaqRoute() {
  return <FaqPage />;
}
