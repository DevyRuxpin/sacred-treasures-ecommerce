import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function withAuth(
  handler: (req: NextRequest, context: { params: Promise<Record<string, unknown>> }) => Promise<NextResponse>,
  options?: { requireAuth?: boolean; requireAdmin?: boolean }
) {
  return async (req: NextRequest, context: { params: Promise<Record<string, unknown>> }) => {
    const session = await getServerSession(authOptions)
    
    if (options?.requireAuth && !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (options?.requireAdmin && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    
    return handler(req, context)
  }
}
