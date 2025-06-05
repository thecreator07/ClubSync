// emails/UserWelcomeEmail.tsx
import {
  Html,
  Head,
  Preview,
  Heading,
  Section,
  Text,
} from '@react-email/components';

interface UserWelcomeEmailProps {
  username: string;

  clubName?: string;
}

export default function UserWelcomeEmail({ username, clubName }: UserWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {clubName ? clubName : 'the club'} 🎉</Preview>
      <Section style={{ padding: '20px' }}>
        <Heading>👋 Welcome, {username}!</Heading>
        <Text>Thank you for registering with as member.</Text>
        <Text>We're excited to have you onboard! You can now explore clubs, participate in events, and start building your profile.</Text>
        <Text>— The ClubManager Team</Text>
      </Section>
    </Html>
  );
}
