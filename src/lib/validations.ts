import { z } from "zod";

export const orderFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  quantity: z.number().int().min(1).max(10),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

export const waitlistFormSchema = z.object({
  name: z.string().min(2, "Veuillez indiquer votre nom"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  location: z.enum(["cabinet", "distance", "indifferent"]),
  sessionType: z.enum(["roqya", "tcc", "indifferent"]),
  availability: z.string().optional().default(""),
});

export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;

export const BOOK_PRICE = 12;
export const SHIPPING_PRICE = 5;

export function calculateTotal(quantity: number): number {
  return BOOK_PRICE * quantity + SHIPPING_PRICE;
}
