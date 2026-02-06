"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { videos, videoCategories } from "@/config/videos";
import { Play } from "lucide-react";

export function VideoGrid() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  return (
    <div>
      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {videoCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-foreground hover:bg-accent/80"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group rounded-xl bg-white border border-border/50 shadow-sm overflow-hidden"
            >
              {/* Thumbnail / Player */}
              <div className="relative aspect-video bg-muted">
                {playingVideo === video.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                    title={video.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    onClick={() => setPlayingVideo(video.id)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* YouTube thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 ml-1" />
                    </div>
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {videoCategories.find((c) => c.id === video.category)?.label}
                </span>
                <h3 className="mt-1 font-semibold line-clamp-2">
                  {video.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
