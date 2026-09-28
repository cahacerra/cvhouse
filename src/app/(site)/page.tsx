import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { EventInfo } from "@/components/home/EventInfo";
import { GiftPreview } from "@/components/home/GiftPreview";
import { FinalMessage } from "@/components/home/FinalMessage";
import {
  getEventSettings,
  getSitePhotos,
  getActiveGifts,
} from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, photos, gifts] = await Promise.all([
    getEventSettings(),
    getSitePhotos(),
    getActiveGifts(),
  ]);

  const featured = gifts.filter((g) => g.featured);
  const preview = (featured.length > 0 ? featured : gifts).slice(0, 3);

  return (
    <>
      <Hero coupleNames={settings?.couple_names ?? "Catarina & Vitor"} photo={photos.hero} />
      <Story />
      <EventInfo settings={settings} />
      <GiftPreview gifts={preview} />
      <FinalMessage
        finalMessage={settings?.final_message ?? null}
        coupleNames={settings?.couple_names ?? "Catarina & Vitor"}
      />
    </>
  );
}
