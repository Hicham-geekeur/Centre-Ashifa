"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Loader2, CheckCircle } from "lucide-react";

const SELECT_CLASS =
  "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm";

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  location: "indifferent",
  sessionType: "roqya",
  availability: "",
};

export function WaitlistForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(INITIAL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData(INITIAL);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">
          Vous êtes inscrit·e sur la liste d&apos;attente !
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Nous vous contacterons dès qu&apos;un créneau se libère. Un email de
          confirmation vient de vous être envoyé.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          Inscrire une autre personne
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="wl-name" className="text-sm font-medium mb-1.5 block">
            Nom complet *
          </label>
          <Input
            id="wl-name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Votre nom"
            required
          />
        </div>
        <div>
          <label htmlFor="wl-email" className="text-sm font-medium mb-1.5 block">
            Email *
          </label>
          <Input
            id="wl-email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="votre@email.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="wl-phone" className="text-sm font-medium mb-1.5 block">
            Téléphone *
          </label>
          <Input
            id="wl-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="06 XX XX XX XX"
            required
          />
        </div>
        <div>
          <label htmlFor="wl-location" className="text-sm font-medium mb-1.5 block">
            Lieu de la séance
          </label>
          <select
            id="wl-location"
            className={SELECT_CLASS}
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
          >
            <option value="indifferent">Indifférent</option>
            <option value="cabinet">Au cabinet</option>
            <option value="distance">À distance</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="wl-availability" className="text-sm font-medium mb-1.5 block">
          Vos disponibilités préférées
        </label>
        <Textarea
          id="wl-availability"
          value={formData.availability}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, availability: e.target.value }))
          }
          placeholder="Ex. : soirées en semaine, samedi matin, plutôt en journée..."
          rows={3}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full h-12">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Bell className="mr-2 h-4 w-4" />
        )}
        {loading ? "Inscription en cours..." : "Rejoindre la liste d'attente"}
      </Button>
    </form>
  );
}
