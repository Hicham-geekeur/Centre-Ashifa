import { siteConfig } from "@/config/site";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone.primary,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRégion: siteConfig.location.région,
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.location.lat,
      longitude: siteConfig.location.lng,
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.location.city,
    },
    founder: {
      "@type": "Person",
      name: siteConfig.practitioner.name,
      jobTitle: siteConfig.practitioner.title,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Roqya-thérapie",
            description:
              "Accompagnement par les mots du Saint Coran pour les maux d'origine occulte.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Thérapie Cognitive et Comportementale (TCC)",
            description:
              "Identification et modification des pensées et comportements problématiques.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BookSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "La Roqya Thérapie",
    author: {
      "@type": "Person",
      name: siteConfig.practitioner.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    inLanguage: "fr",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      priceCurrency: "EUR",
      url: `${siteConfig.url}/livre`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
