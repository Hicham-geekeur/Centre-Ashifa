export interface Video {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  description: string;
}

export const videoCategories = [
  { id: "all", label: "Toutes les videos" },
  { id: "roqya", label: "Roqya" },
  { id: "waswas", label: "WasWas" },
  { id: "mauvais-oeil", label: "Mauvais oeil" },
  { id: "sihr", label: "Sorcellerie" },
  { id: "hasad", label: "Jalousie / Hasad" },
  { id: "coran", label: "Coran" },
  { id: "rappels", label: "Rappels" },
  { id: "series", label: "Series" },
] as const;

export const videos: Video[] = [
  // ─── Roqya ───
  {
    id: "1",
    title: "ROQYA - Contre le mauvais oeil, Sihr, Mass et Hasad",
    category: "roqya",
    youtubeId: "ceYdjwkfbK0",
    description:
      "Séance de Roqya complete contre le mauvais oeil, la sorcellerie, le mass et le hasad. 1,3M de vues.",
  },
  {
    id: "2",
    title: "La solution pour vaincre les waswas",
    category: "roqya",
    youtubeId: "rdhWnfMkBso",
    description:
      "Découvrez la méthode efficace pour vaincre les waswas et retrouver la serenite au quotidien.",
  },
  {
    id: "3",
    title: "Chapitre 1 : La sorcellerie ep 1 - Definition & Introduction",
    category: "sihr",
    youtubeId: "bNEH4eTuPio",
    description:
      "Premier episode de la serie sur la sorcellerie : definition, introduction et fondements islamiques.",
  },

  // ─── WasWas ───
  {
    id: "4",
    title: "LE WASWAS",
    category: "waswas",
    youtubeId: "u5BO1TIHWac",
    description:
      "Comprendre le phenomene du waswas (chuchotements), ses causes et les remedes prophetiques. 10k vues.",
  },

  // ─── Mauvais oeil ───
  {
    id: "5",
    title: "LE MAUVAIS OEIL",
    category: "mauvais-oeil",
    youtubeId: "Rjs2DWhNmgc",
    description:
      "Explication complete du mauvais oeil : ses signes, ses effets et les méthodes de protection.",
  },

  // ─── Jalousie / Hasad ───
  {
    id: "6",
    title: "Un virus mortel : LA JALOUSIE",
    category: "hasad",
    youtubeId: "JCSHQW4_im8",
    description:
      "La jalousie analysee comme un virus destructeur. Causes, consequences et remedes islamiques.",
  },
  {
    id: "7",
    title: "Al Hasad : ses causes, ses degats et son traitement",
    category: "hasad",
    youtubeId: "zkEgu2Di2ms",
    description:
      "Cours en arabe sur le hasad (jalousie) : ses origines, ses effets nefastes et les moyens de s'en proteger.",
  },

  // ─── Coran ───
  {
    id: "8",
    title: "Extrait de Sourate An-Nissa - Larbi Al Khattab",
    category: "coran",
    youtubeId: "9yab66IWLlI",
    description:
      "Recitation de versets de Sourate An-Nissa par Sheikh Larbi Al Khattab.",
  },
  {
    id: "9",
    title: "Versets de Sourate Al Furqan - Sheikh Larbi Al Khattab",
    category: "coran",
    youtubeId: "XQs9b989mlI",
    description:
      "Recitation de versets de Sourate Al Furqan par Sheikh Larbi Al Khattab.",
  },
  {
    id: "10",
    title: "Surat Al Isra - Riwayat Khalaf - Larbi Al Khattab",
    category: "coran",
    youtubeId: "lJyBzEiIzqA",
    description:
      "Recitation de Sourate Al Isra selon la riwaya de Khalaf par Sheikh Larbi Al Khattab.",
  },
  {
    id: "11",
    title: "Sourate Al Jinn - Sheikh Larbi Al Khattab",
    category: "coran",
    youtubeId: "7GRXb5-QlIE",
    description:
      "Recitation sous-titree de Sourate Al Jinn par Sheikh Larbi Al Khattab.",
  },
  {
    id: "12",
    title: "Apprends le Coran facilement - Partie 1/2",
    category: "coran",
    youtubeId: "ZonF2hOeD7Y",
    description:
      "Methode pratique pour apprendre le Coran facilement. Premiere partie.",
  },
  {
    id: "13",
    title: "Apprends le Coran facilement - Partie 2/2",
    category: "coran",
    youtubeId: "iPWwV8erP40",
    description:
      "Methode pratique pour apprendre le Coran facilement. Deuxieme partie.",
  },

  // ─── Rappels ───
  {
    id: "14",
    title: "L'interpretation des reves en Islam",
    category: "rappels",
    youtubeId: "6DcOl4C-CB0",
    description:
      "Les regles de l'interpretation des reves en Islam : ce qu'il faut savoir et les erreurs a eviter.",
  },
  {
    id: "15",
    title: "J'AI REVE DU PROPHETE - Que faire ?",
    category: "rappels",
    youtubeId: "O8JIQpu_WAA",
    description:
      "Que signifie rever du Prophete et comment reagir selon les enseignements islamiques.",
  },
  {
    id: "16",
    title: "Rappel Islamique emouvant - Reboost ta foi - Episode 1",
    category: "rappels",
    youtubeId: "krvXZVdHymQ",
    description:
      "Un rappel emouvant pour raviver la foi. Premier episode de la serie Reboost ta foi. 12k vues.",
  },
  {
    id: "17",
    title: "Incroyable Histoire ! Il invoqua Allah et soudain...",
    category: "rappels",
    youtubeId: "wChqxY95xEM",
    description:
      "Une histoire incroyable et emouvante sur la puissance de l'invocation. 84k vues.",
  },
  {
    id: "18",
    title: "TOUCHE PAS A MON PRECHE",
    category: "rappels",
    youtubeId: "x1_JglcO6lY",
    description:
      "Reflexion sur la liberte du preche et la responsabilite du precepteur en Islam.",
  },
  {
    id: "19",
    title: "CARICATURES - Comment reagir ?",
    category: "rappels",
    youtubeId: "H55zelo7TN0",
    description:
      "Comment reagir face aux caricatures selon les enseignements islamiques.",
  },
  {
    id: "20",
    title: "LE RACISME",
    category: "rappels",
    youtubeId: "sHIAyIIzucs",
    description:
      "Le racisme vu a travers le prisme de l'Islam : interdiction et remedes.",
  },
  {
    id: "21",
    title: "Le gaz hilarant, un fleau dangereux",
    category: "rappels",
    youtubeId: "hdkARE-VpHg",
    description:
      "Mise en garde contre le gaz hilarant et ses dangers pour la sante et la societe.",
  },
  {
    id: "22",
    title: "Ibrahim (As), les anges sont venus lui annoncer que...",
    category: "rappels",
    youtubeId: "HiQcL8F1Yt0",
    description:
      "L'histoire du prophete Ibrahim et la visite des anges. Un recit plein d'enseignements.",
  },
  {
    id: "23",
    title: "Forcer la porte de la mosquee pour prier ?!",
    category: "rappels",
    youtubeId: "M5GujeoNpbo",
    description:
      "Reflexion sur l'acces aux mosquees et la priere en congregation.",
  },
  {
    id: "24",
    title: "Rappel choc ! Le football et les fous de la balle",
    category: "rappels",
    youtubeId: "JlaM2u7gedE",
    description:
      "Un rappel sur l'exces dans le divertissement et l'équilibre dans la vie du musulman.",
  },
  {
    id: "25",
    title: "Faut-il jeuner quand il fait trop chaud ?",
    category: "rappels",
    youtubeId: "F7BlnnCslyQ",
    description:
      "Les regles du jeune en periode de grande chaleur selon les savants de l'Islam.",
  },
  {
    id: "26",
    title: "Message aux responsables de la Grande Mosquee de Strasbourg",
    category: "rappels",
    youtubeId: "fhlUQ_0rosg",
    description:
      "Message adresse aux responsables de la Grande Mosquee de Strasbourg.",
  },

  // ─── Series ───
  {
    id: "27",
    title: "La fin du monde est proche - Episode 1",
    category: "series",
    youtubeId: "PEGwL0rhBDU",
    description:
      "Premier episode de la serie sur les signes de la fin des temps. 13k vues.",
  },
  {
    id: "28",
    title: "Les signes de la fin des temps - Avant-première",
    category: "series",
    youtubeId: "Vmi1c44_kxg",
    description:
      "Bande-annonce de la serie sur les signes de la fin des temps.",
  },
  {
    id: "29",
    title: "Salman Al Farissy - Serie : Les compagnons du Prophete",
    category: "series",
    youtubeId: "dfbPrg6Uk_g",
    description:
      "L'histoire de Salman Al Farissy, premier episode de la serie sur les compagnons du Prophete.",
  },
];
