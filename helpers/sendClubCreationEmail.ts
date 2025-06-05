// import ClubCreationEmail from "@/emails/ClubCreationEmail";
import ClubCreationEmail from "@/emails/ClubCreationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponce";
export async function sendClubCreationEmail(
  email: string,
  username: string,
  clubName: string,
  clubSlug: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: 'ClubManager <no-reply@amankp.in>',
      to: email,
      subject: `🎉 Your club "${clubName}" has been created!`,
      react: ClubCreationEmail({ username, clubName, clubSlug }),
    });

    console.log("Club creation email response:", data);
    return { success: true, message: 'Club creation email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending club creation email:', emailError);
    return { success: false, message: 'Failed to send club creation email.' };
  }
}
