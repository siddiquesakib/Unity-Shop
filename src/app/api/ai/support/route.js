import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("📨 Support request received:", body);

    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:5000";
    const url = `${backendUrl}/api/ai/support`;
    console.log("🔄 Forwarding to backend:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log("📡 Backend response status:", response.status);

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Backend error:", data);
      return NextResponse.json(
        { error: data.error || "Backend error" },
        { status: response.status },
      );
    }
    console.log("✅ Backend success:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("🔥 Support proxy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
