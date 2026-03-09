import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${card.name}`,
    card.title ? `TITLE:${card.title}` : "",
    card.company ? `ORG:${card.company}` : "",
    card.phone ? `TEL;TYPE=CELL:${card.phone}` : "",
    card.email ? `EMAIL:${card.email}` : "",
    card.website ? `URL:${card.website}` : "",
    card.address ? `ADR;TYPE=WORK:;;${card.address};;;;` : "",
    card.bio ? `NOTE:${card.bio}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard",
      "Content-Disposition": `attachment; filename="${card.name.replace(/\s+/g, "_")}.vcf"`,
    },
  });
}
