import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    const adminCode = process.env.ADMIN_SECURITY_CODE || "TITAN2024"

    if (code === adminCode) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
