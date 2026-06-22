import { HomePageContent } from "@/components/localized/home-page";
import { JsonLd } from "@/components/json-ld";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";
import { parseLocaleParam } from "@/lib/i18n/parse-locale-param";
import { buildSiteJsonLd } from "@/lib/seo/site-json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.home.metaTitle,
    description: dictionary.home.metaDescription,
  }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = parseLocaleParam(localeParam);

  return (
    <>
      <JsonLd data={buildSiteJsonLd(locale)} />
      <HomePageContent />
    </>
  );
}
