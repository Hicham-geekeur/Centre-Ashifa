export const mainNavItems = [
  { label: "Accueil", href: "/" },
  {
    label: "Nos Services",
    href: "#",
    children: [
      { label: "Roqya-thérapie", href: "/roqya-thérapie" },
      { label: "Thérapie cognitive (TCC)", href: "/thérapie-cognitive" },
    ],
  },
  { label: "Le Livre", href: "/livre" },
  { label: "Nous soutenir", href: "/soutenir" },
  { label: "Videos", href: "/videos" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNavItems = {
  services: [
    { label: "Roqya-thérapie", href: "/roqya-thérapie" },
    { label: "Thérapie cognitive (TCC)", href: "/thérapie-cognitive" },
  ],
  informations: [
    { label: "À propos", href: "/a-propos" },
    { label: "FAQ", href: "/faq" },
    { label: "Videos", href: "/videos" },
    { label: "Le Livre", href: "/livre" },
    { label: "Nous soutenir", href: "/soutenir" },
  ],
  legal: [
    { label: "Mentions legales", href: "/mentions-legales" },
    { label: "Politique de confidentialite", href: "/politique-confidentialite" },
    { label: "CGV", href: "/cgv" },
  ],
} as const;
