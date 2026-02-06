import type { Metadata } from "next";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { VideoGrid } from "@/components/videos/VideoGrid";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Videotheque du Centre Ashifa : videos educatives sur la Roqya-thérapie, le WasWas, le mauvais oeil, le Sihr, le Mass et le Hasad.",
  openGraph: {
    title: "Videos | Centre Ashifa",
    description:
      "Videos educatives sur la Roqya-thérapie et la protection spirituelle.",
  },
};

export default function VideosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 bg-gradient-to-b from-accent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="outline" className="mb-4">
              Videotheque
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Nos videos educatives
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Retrouvez nos videos sur les differentes thematiques liees a la
              Roqya-thérapie et la protection spirituelle.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Video grid with filters */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VideoGrid />
        </div>
      </section>
    </>
  );
}
