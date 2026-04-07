import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { researchReports } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await params;

  const [report] = await getDb()
    .select()
    .from(researchReports)
    .where(
      and(
        eq(researchReports.id, id),
        eq(researchReports.userId, session.user.id)
      )
    )
    .limit(1);

  if (!report) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(report), {
    headers: { "Content-Type": "application/json" },
  });
}
