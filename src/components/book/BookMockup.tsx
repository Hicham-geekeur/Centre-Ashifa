"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Single realistic 3D book mockup showing front cover, spine, and back.
 * Uses CSS 3D transforms with the real cover images.
 */
/**
 * Back cover mockup — shows the fourth cover (quatrième de couverture)
 * with a subtle 3D angle. Smaller scale, ideal next to content sections.
 */
export function BackCoverMockup({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Shadow */}
        <div className="absolute -bottom-4 left-6 right-4 h-6 rounded-full bg-black/15 blur-xl" />

        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(15deg) rotateX(3deg)",
          }}
        >
          {/* Back cover image */}
          <div className="relative overflow-hidden rounded-sm shadow-2xl ring-1 ring-black/10">
            <Image
              src="/images/couverture-livre-dos.png"
              alt="Quatrième de couverture — La Roqya à la lumière du Tawhid"
              width={672}
              height={992}
              className="block w-full h-auto"
              quality={90}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 45%, rgba(255,255,255,0.06) 50%, transparent 60%)",
              }}
            />
          </div>

          {/* Page edges (left) */}
          <div
            className="absolute top-[3px] bottom-[3px] -left-[5px]"
            style={{
              width: "5px",
              background:
                "repeating-linear-gradient(to bottom, #f5f0e8 0px, #e8e0d4 1px, #f5f0e8 2px)",
              borderRadius: "2px 0 0 2px",
            }}
          />

          {/* Page edges (bottom) */}
          <div
            className="absolute -bottom-[4px] left-[3px] right-[3px]"
            style={{
              height: "4px",
              background:
                "repeating-linear-gradient(to right, #f5f0e8 0px, #e8e0d4 1px, #f5f0e8 2px)",
              borderRadius: "0 0 2px 2px",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Single realistic 3D book mockup showing front cover, spine, and back.
 * Uses CSS 3D transforms with the real cover images.
 */
export function BookMockup3D({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: "1200px" }}
      >
        {/* Book shadow */}
        <div
          className="absolute -bottom-6 left-8 right-2 h-8 rounded-full bg-black/20 blur-2xl"
          style={{ transform: "skewX(8deg)" }}
        />

        {/* 3D book container */}
        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(-25deg) rotateX(5deg)",
          }}
        >
          {/* === FRONT COVER === */}
          <div
            className="relative overflow-hidden rounded-r-sm shadow-2xl"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(10px)",
            }}
          >
            <Image
              src="/images/couverture-livre.png"
              alt="La Roqya à la lumière du Tawhid — Larbi Al-Khattab"
              width={672}
              height={992}
              className="block w-full h-auto"
              priority
              quality={90}
            />
            {/* Subtle light reflection */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 48%, rgba(255,255,255,0.03) 55%, transparent 65%)",
              }}
            />
          </div>

          {/* === SPINE (left edge) === */}
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{
              width: "20px",
              transformOrigin: "left center",
              transform: "rotateY(-90deg) translateX(-20px)",
            }}
          >
            <Image
              src="/images/couverture-livre-tranche.png"
              alt="Tranche du livre"
              width={20}
              height={992}
              className="block h-full w-full object-cover"
            />
            {/* Spine shadow gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.05))",
              }}
            />
          </div>

          {/* === BACK COVER (behind) === */}
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-l-sm"
            style={{
              transform: "translateZ(-10px)",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src="/images/couverture-livre-dos.png"
              alt="Quatrième de couverture"
              width={672}
              height={992}
              className="block w-full h-auto"
              style={{ transform: "scaleX(-1)" }}
            />
            {/* Darker overlay for depth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "rgba(0,10,30,0.15)",
              }}
            />
          </div>

          {/* === PAGE EDGES (right side) === */}
          <div
            className="absolute top-[3px] bottom-[3px] -right-[7px]"
            style={{
              width: "7px",
              background:
                "repeating-linear-gradient(to bottom, #f5f0e8 0px, #e8e0d4 1px, #f5f0e8 2px)",
              borderRadius: "0 2px 2px 0",
              transform: "translateZ(5px)",
              boxShadow: "2px 0 6px rgba(0,0,0,0.08)",
            }}
          />

          {/* === PAGE EDGES (bottom) === */}
          <div
            className="absolute -bottom-[5px] left-[3px] right-[3px]"
            style={{
              height: "5px",
              background:
                "repeating-linear-gradient(to right, #f5f0e8 0px, #e8e0d4 1px, #f5f0e8 2px)",
              borderRadius: "0 0 2px 2px",
              transform: "translateZ(5px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
