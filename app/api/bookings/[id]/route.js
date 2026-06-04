import { NextResponse } from "next/server";
import { deleteBooking, updateBooking } from "../../../../lib/db";
import { isAdminLoggedIn } from "../../../../lib/auth";

export async function POST(request, { params }) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  }

  const formData = await request.formData();
  const action = String(formData.get("action") || "update");
  const { id } = await params;

  if (action === "delete") {
    await deleteBooking(id);
  } else {
    await updateBooking(id, {
      status: String(formData.get("status") || "NEW"),
      priority: String(formData.get("priority") || "STANDARD")
    });
  }

  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
