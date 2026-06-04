import { NextResponse } from "next/server";
import { createBooking } from "../../../lib/db";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const booking = await createBooking({
      fullName: String(formData.get("fullName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      date: String(formData.get("date") || ""),
      time: String(formData.get("time") || ""),
      guests: String(formData.get("guests") || "1"),
      request: String(formData.get("request") || "").trim(),
      priority: String(formData.get("priority") || "STANDARD")
    });

    return NextResponse.redirect(new URL(`/?reserved=${booking.ref}`, request.url), 303);
  } catch (error) {
    return NextResponse.redirect(new URL(`/?bookingError=${encodeURIComponent(error.message)}`, request.url), 303);
  }
}
