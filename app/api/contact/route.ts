import { NextResponse } from "next/server";
import { resend } from "@/lib/resend"; // Make sure resend is set up
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = ContactSchema.parse(body);

    await resend.emails.send({
      from: "Club Contact <no-reply@amankp.in>",
      to: "amankumarprasad43@gmail.com", // Replace with actual admin email
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Message sent." });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false, message: "Failed to send message." }, { status: 500 });
  }
}
