import { HeroSection } from "@/components/home/HeroSection";
import { TrustSignals } from "@/components/home/TrustSignals";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { PractitionerSection } from "@/components/home/PractitionerSection";
import { BookPreviewSection } from "@/components/home/BookPreviewSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { SupportSection } from "@/components/home/SupportSection";
import { AppointmentCTA } from "@/components/home/AppointmentCTA";
import { getDonationStats } from "@/lib/donation-stats";

export default async function Home() {
  const stats = await getDonationStats();
  return (
    <>
      <HeroSection stats={stats} />
      <SupportSection />
      <TrustSignals />
      <ServicesOverview />
      <PractitionerSection />
      <BookPreviewSection />
      <TestimonialsSection />
      <StatsSection />
      <AppointmentCTA />
    </>
  );
}

/**
 * Rendu à la demande : les statistiques de dons viennent de Stripe (cache 1 h)
 * et ne doivent pas être figées au build, où la clé Stripe est absente.
 */
export const dynamic = "force-dynamic";
