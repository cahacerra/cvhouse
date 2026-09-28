import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getEventSettings } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getEventSettings();

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
