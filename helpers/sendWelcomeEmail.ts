// helpers/sendUserWelcomeEmail.ts
// import UserWelcomeEmail from "@/emails/UserWelcomeEmail";
import UserWelcomeEmail from "@/emails/WelcomeInClub";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponce";

export async function sendUserWelcomeEmail(
  email: string,
  username: string,
  clubName?: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: 'ClubManager <no-reply@amankp.in>',
      to: email,
      subject: `👋 Welcome to ClubManager, ${username}!`,
      react: UserWelcomeEmail({ username, clubName }),
    });

    console.log("Welcome email response:", data);
    return { success: true, message: "Welcome email sent successfully." };
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
    return { success: false, message: "Failed to send welcome email." };
  }
}
