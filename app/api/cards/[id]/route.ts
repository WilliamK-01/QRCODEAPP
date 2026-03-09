import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card || card.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = await req.json();
    const { name, title, company, phone, email, website, address, bio, profileImage } = body;
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const updated = await prisma.card.update({
      where: { id },
      data: { name: name.trim(), title, company, phone, email, website, address, bio, profileImage },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card || card.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.card.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
