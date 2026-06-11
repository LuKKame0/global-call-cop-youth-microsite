import { MesaPageContent } from "@/components/localized/mesa-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.mesa.metaTitle,
    description: dictionary.mesa.metaDescription,
  }));
}

export default function MesaPage() {
  return <MesaPageContent />;
}
