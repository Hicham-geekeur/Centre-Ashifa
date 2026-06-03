import { NextRequest, NextResponse } from "next/server";
import { waitlistFormSchema } from "@/lib/validations";
import { saveWaitlistEntry, generateWaitlistId, type WaitlistEntry } from "@/lib/waitlist";
import { sendWaitlistEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = waitlistFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Veuillez remplir correctement tous les champs obligatoires" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const entry: WaitlistEntry = {
      id: generateWaitlistId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      sessionType: data.sessionType,
      availability: data.availability,
      createdAt: new Date().toISOString(),
    };

    saveWaitlistEntry(entry);

    try {
      await sendWaitlistEmails(entry);
    } catch (mailError) {
      // L'inscription est sauvegardée même si l'email échoue : on ne perd pas le contact.
      console.error("Waitlist email error:", mailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription à la liste d'attente" },
      { status: 500 }
    );
  }
}
