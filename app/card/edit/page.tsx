"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface CardForm {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  bio: string;
  profileImage: string;
}

const empty: CardForm = {
  name: "", title: "", company: "", phone: "", email: "",
  website: "", address: "", bio: "", profileImage: "",
};

export default function EditCardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<CardForm>(empty);
  const [cardId, setCardId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/cards")
        .then((r) => r.json())
        .then((data) => {
          if (data?.id) {
            setCardId(data.id);
            setForm({
              name: data.name || "",
              title: data.title || "",
              company: data.company || "",
              phone: data.phone || "",
              email: data.email || "",
              website: data.website || "",
              address: data.address || "",
              bio: data.bio || "",
              profileImage: data.profileImage || "",
            });
          }
          setLoading(false);
        });
    }
  }, [status]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const url = cardId ? `/api/cards/${cardId}` : "/api/cards";
    const method = cardId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Failed to save");
      return;
    }
    const data = await res.json();
    if (!cardId) setCardId(data.id);
    setSaved(true);
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const fields: { label: string; name: keyof CardForm; type?: string; required?: boolean; placeholder?: string }[] = [
    { label: "Full name *", name: "name", required: true, placeholder: "Jane Doe" },
    { label: "Job title", name: "title", placeholder: "Software Engineer" },
    { label: "Company", name: "company", placeholder: "Acme Corp" },
    { label: "Phone", name: "phone", type: "tel", placeholder: "+1 555 000 0000" },
    { label: "Email", name: "email", type: "email", placeholder: "jane@example.com" },
    { label: "Website", name: "website", type: "url", placeholder: "https://example.com" },
    { label: "Address", name: "address", placeholder: "123 Main St, City, State" },
    { label: "Profile image URL", name: "profileImage", type: "url", placeholder: "https://example.com/photo.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{cardId ? "Edit card" : "Create card"}</h1>
            <p className="text-gray-500 text-sm mt-1">Changes update your card instantly without changing your QR code.</p>
          </div>
          {cardId && (
            <Link href="/card/qr" className="text-sm text-indigo-600 hover:underline">
              View QR →
            </Link>
          )}
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required={f.required}
                placeholder={f.placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / tagline</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="A short description about yourself"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {saved && <p className="text-green-600 text-sm">✓ Saved successfully</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save card"}
            </button>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
