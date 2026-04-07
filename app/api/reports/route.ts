import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { researchReports } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const reports = await getDb()
    .select({
      id: researchReports.id,
      companyName: researchReports.companyName,
      domain: researchReports.domain,
      cost: researchReports.cost,
      duration: researchReports.duration,
      createdAt: researchReports.createdAt,
    })
    .from(researchReports)
    .where(eq(researchReports.userId, session.user.id))
    .orderBy(desc(researchReports.createdAt))
    .limit(50);

  return new Response(JSON.stringify(reports), {
    headers: { "Content-Type": "application/json" },
  });
}
