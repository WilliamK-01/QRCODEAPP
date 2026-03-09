import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) return { title: "Card not found" };
  return {
    title: `${card.name} – Digital Business Card`,
    description: card.bio || `${card.name}'s digital business card`,
  };
}

export default async function PublicCardPage({ params }: Props) {
  const { id } = await params;
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-start justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-8 text-center">
          {card.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.profileImage}
              alt={card.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-400 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
              {card.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-white text-xl font-bold">{card.name}</h1>
          {card.title && <p className="text-indigo-200 text-sm mt-1">{card.title}</p>}
          {card.company && <p className="text-indigo-200 text-sm">{card.company}</p>}
        </div>

        {/* Bio */}
        {card.bio && (
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-gray-600 text-sm text-center">{card.bio}</p>
          </div>
        )}

        {/* Contact actions */}
        <div className="px-6 py-4 space-y-3">
          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition"
            >
              <span className="text-2xl">📞</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-800">{card.phone}</p>
              </div>
            </a>
          )}
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition"
            >
              <span className="text-2xl">✉️</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800">{card.email}</p>
              </div>
            </a>
          )}
          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition"
            >
              <span className="text-2xl">🌐</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Website</p>
                <p className="text-sm font-medium text-gray-800">{card.website}</p>
              </div>
            </a>
          )}
          {card.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(card.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition"
            >
              <span className="text-2xl">📍</span>
              <div className="text-left">
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm font-medium text-gray-800">{card.address}</p>
              </div>
            </a>
          )}
        </div>

        {/* Save contact */}
        <div className="px-6 pb-6">
          <a
            href={`/api/vcard/${card.id}`}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition"
          >
            <span>💾</span> Save contact
          </a>
        </div>
      </div>
    </div>
  );
}
