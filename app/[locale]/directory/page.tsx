import { DirectoryPageContent } from "@/components/localized/directory-page";
import { buildLocalizedMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return buildLocalizedMetadata(params, (dictionary) => ({
    title: dictionary.directory?.metaTitle ?? "Directory",
    description: dictionary.directory?.metaDescription ?? "",
  }));
}

export default function DirectoryPage() {
  return <DirectoryPageContent />;
}
