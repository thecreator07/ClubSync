import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface ClubCreationEmailProps {
  username: string;
  clubName: string;
  clubSlug: string;
}



export default function ClubCreationEmail({
  username,
  clubName,
  clubSlug,
}: ClubCreationEmailProps) {
  return (
    <Html>
      <Head>
        <title>Club Created Successfully</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{clubName} has been successfully created!</Preview>
      <Section style={{ padding: '20px', fontFamily: 'Roboto, Verdana' }}>
        <Row>
          <Heading as="h2">🎉 Congratulations, {username}!</Heading>
        </Row>
        <Row>
          <Text>
            Your club <strong>{clubName}</strong> has been successfully created
            and is now live on the platform.
          </Text>
        </Row>
        <Row>
          <Text>
            You can manage your club, add members, organize events, and more from your club dashboard.
          </Text>
        </Row>
        <Row>
          <Text>
            Access your club page here:
            <br />
            <a
              href={`https://yourdomain.com/clubs/${clubSlug}`}
              style={{ color: '#2563eb' }}
            >
              https://yourdomain.com/clubs/{clubSlug}
            </a>
          </Text>
        </Row>
        <Row>
          <Text>
            If you have any questions or need help, feel free to contact support.
          </Text>
        </Row>
        <Row>
          <Text>Happy organizing!</Text>
          <Text>The Club Management Team</Text>
        </Row>
      </Section>
    </Html>
  );
}
