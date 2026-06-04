import { NextResponse } from "next/server";
import { setAdminSession, validateCredentials } from "../../../lib/auth";

export async function POST(request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  if (!validateCredentials(username, password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  await setAdminSession();
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
