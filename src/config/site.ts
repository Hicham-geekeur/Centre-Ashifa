export const siteConfig = {
  name: "Centre Ashifa",
  url: "https://centre-ashifa.fr",
  description:
    "Centre Ashifa - Séances de Roqya-thérapie et thérapie cognitive comportementale (TCC) à Strasbourg et sa région. Praticien certifié Larbi DJEDADOUA.",
  email: "centre.ashifa67@gmail.com",
  phone: {
    primary: "+33768848483",
    display: "07 68 84 84 83",
    secondary: "+33753613611",
    secondaryDisplay: "07 53 61 36 11",
  },
  location: {
    city: "Strasbourg",
    région: "Bas-Rhin, Grand Est",
    country: "France",
    lat: 48.5734,
    lng: 7.7521,
  },
  practitioner: {
    name: "Larbi DJEDADOUA",
    title: "Praticien certifié en thérapie cognitive et comportementale",
    credentials: [
      "Praticien certifié en TCC",
      "Ijaza dans les 10 lectures du Saint Coran",
      "Specialiste en Roqya-thérapie",
    ],
  },
  social: {
    instagram: "https://www.instagram.com/larbi_alkhattab/",
    youtube: "https://www.youtube.com/@centreashifa",
  },
} as const;
