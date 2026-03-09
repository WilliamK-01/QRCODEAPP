"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import Navbar from "@/components/Navbar";

export default function QRPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/cards")
        .then((r) => r.json())
        .then((data) => {
          if (data?.id) setCardId(data.id);
          setLoading(false);
        });
    }
  }, [status]);

  useEffect(() => {
    if (cardId && canvasRef.current) {
      const url = `${window.location.origin}/card/${cardId}`;
      QRCode.toCanvas(canvasRef.current, url, {
        width: 280,
        margin: 2,
        color: { dark: "#1e1b4b", light: "#ffffff" },
      });
    }
  }, [cardId]);

  function downloadQR() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qr-business-card.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  }

  async function copyLink() {
    if (!cardId) return;
    await navigator.clipboard.writeText(`${window.location.origin}/card/${cardId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareQR() {
    if (!cardId) return;
    const url = `${window.location.origin}/card/${cardId}`;
    if (navigator.share) {
      await navigator.share({ title: "My Business Card", url });
    } else {
      await copyLink();
    }
  }

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!cardId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 mb-4">Create your card first.</p>
          <a href="/card/edit" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700">
            Create card
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your QR code</h1>
        <p className="text-gray-500 text-sm mb-8">
          Share this QR code. Anyone who scans it will see your card.
        </p>
        <div className="bg-white inline-block p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={downloadQR}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Download PNG
          </button>
          <button
            onClick={shareQR}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
          >
            Share
          </button>
          <button
            onClick={copyLink}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Card URL: {typeof window !== "undefined" && cardId ? `${window.location.origin}/card/${cardId}` : ""}
        </p>
      </main>
    </div>
  );
}
