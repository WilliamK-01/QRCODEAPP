import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const card = await prisma.card.findFirst({ where: { userId: session.user.id } });
  return NextResponse.json(card);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { name, title, company, phone, email, website, address, bio, profileImage } = body;
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const existing = await prisma.card.findFirst({ where: { userId: session.user.id } });
    if (existing) {
      const updated = await prisma.card.update({
        where: { id: existing.id },
        data: { name: name.trim(), title, company, phone, email, website, address, bio, profileImage },
      });
      return NextResponse.json(updated);
    }
    const card = await prisma.card.create({
      data: { userId: session.user.id, name: name.trim(), title, company, phone, email, website, address, bio, profileImage },
    });
    return NextResponse.json(card, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
