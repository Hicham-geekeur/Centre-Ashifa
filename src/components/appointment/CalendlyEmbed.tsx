"use client";

import { useEffect } from "react";

export function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url="https://calendly.com/centre-ashifa/rokya?primary_color=23a455"
      style={{ minWidth: "320px", height: "900px", width: "100%" }}
    />
  );
}
