"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error("Form error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">
          Message envoye !
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Nous vous repondrons dans les meilleurs delais.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSuccess(false)}
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
            Nom complet *
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Votre nom"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
            Email *
          </label>
          <Input
            id="email"
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
          <label htmlFor="phone" className="text-sm font-medium mb-1.5 block">
            Telephone
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="06 XX XX XX XX"
          />
        </div>
        <div>
          <label htmlFor="subject" className="text-sm font-medium mb-1.5 block">
            Sujet
          </label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subject: e.target.value }))
            }
            placeholder="Objet de votre message"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium mb-1.5 block">
          Message *
        </label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          placeholder="Decrivez votre situation..."
          rows={5}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full h-12">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {loading ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
