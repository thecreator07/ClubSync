import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponce';


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
    origin:string
): Promise<ApiResponse> {
    try {
       const data= await resend.emails.send({
            from: 'Amankp Mailer <no-reply@amankp.in>',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode,origin }),
        });
        console.log(data)
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' };
    }
}