import { parseLocaleParam } from "@/lib/i18n/parse-locale-param";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await params.then(({ locale }) => parseLocaleParam(locale));
  return children;
}
