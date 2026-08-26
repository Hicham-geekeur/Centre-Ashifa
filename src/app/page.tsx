import { HeroSection } from "@/components/home/HeroSection";
import { TrustSignals } from "@/components/home/TrustSignals";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { PractitionerSection } from "@/components/home/PractitionerSection";
import { BookPreviewSection } from "@/components/home/BookPreviewSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { SupportSection } from "@/components/home/SupportSection";
import { AppointmentCTA } from "@/components/home/AppointmentCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
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

/** Les statistiques de dons sont rafraîchies toutes les heures. */
export const revalidate = 3600;
