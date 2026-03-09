"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Card {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/cards")
        .then((r) => r.json())
        .then((data) => { setCard(data); setLoading(false); });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">{session?.user?.email}</p>

        {card ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-1">{card.name}</h2>
            {card.title && <p className="text-gray-500 text-sm">{card.title}</p>}
            {card.company && <p className="text-gray-500 text-sm">{card.company}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/card/edit"
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Edit card
              </Link>
              <Link
                href="/card/qr"
                className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                View QR code
              </Link>
              <Link
                href={`/card/${card.id}`}
                target="_blank"
                className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Preview card ↗
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 text-center">
            <p className="text-gray-500 mb-4">You don&apos;t have a card yet.</p>
            <Link
              href="/card/edit"
              className="bg-indigo-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
            >
              Create your card
            </Link>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-600 hover:text-red-500 underline"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
