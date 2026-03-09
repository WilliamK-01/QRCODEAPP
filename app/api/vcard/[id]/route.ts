import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Escape vCard property values to prevent injection (fold long lines, escape special chars). */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

/** Return a safe filename for Content-Disposition (ASCII printable only, no quotes/backslashes). */
function safeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_").slice(0, 64) || "contact";
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(card.name)}`,
    card.title ? `TITLE:${escapeVCardValue(card.title)}` : "",
    card.company ? `ORG:${escapeVCardValue(card.company)}` : "",
    card.phone ? `TEL;TYPE=CELL:${escapeVCardValue(card.phone)}` : "",
    card.email ? `EMAIL:${escapeVCardValue(card.email)}` : "",
    card.website ? `URL:${escapeVCardValue(card.website)}` : "",
    card.address ? `ADR;TYPE=WORK:;;${escapeVCardValue(card.address)};;;;` : "",
    card.bio ? `NOTE:${escapeVCardValue(card.bio)}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeFilename(card.name)}.vcf"`,
    },
  });
}
