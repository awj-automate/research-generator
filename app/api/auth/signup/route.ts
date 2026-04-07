import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (8+ characters) required" },
      { status: 400 }
    );
  }

  const { getDb } = await import("@/lib/db");
  const { users } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");
  const db = getDb();

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    email,
    name: name || null,
    password: hashedPassword,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
