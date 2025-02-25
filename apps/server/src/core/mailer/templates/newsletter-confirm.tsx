import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface NewsletterConfirmProps {
  firstName: string;
  interests: string;
  introduction: string;
  welcome: string;
  interestContent: string;
  newsletterContent: string;
  profile: string;
  footerContent: string;
  baseUrl: string;
  appName: string;
}

export default function NewsletterConfirm({
  firstName,
  interests,
  introduction,
  welcome,
  interestContent,
  newsletterContent,
  profile,
  footerContent,
  baseUrl,
  appName,
}: NewsletterConfirmProps) {
  return (
    <Html>
      <Head />
      <Preview>{introduction}</Preview>
      <Body
        style={{
          paddingTop: '40px',
          paddingBottom: '60px',
          backgroundImage: `url('${baseUrl}/images/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        }}
      >
        <Container style={container}>
          <Img
            src={`${baseUrl}/images/brand.png`}
            alt="Company Logo"
            style={{
              ...logo,
              display: 'block',
              margin: '0 auto',
            }}
          />
          <Section style={content}>
            <Heading style={h1}>
              {welcome} {firstName} !
            </Heading>
            <Text style={text}>
              {interestContent} <strong>{interests}</strong>
            </Text>
            <Text style={text}>{newsletterContent}</Text>
            <Button href="https://www.linkedin.com/in/liam-hg" style={button}>
              {profile}
            </Button>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>{footerContent}</Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'rgb(0,0,0, 0.7)',
              }}
            >
              © {new Date().getFullYear()} | {appName} | {baseUrl}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

NewsletterConfirm.PreviewProps = {
  introduction: 'Merci pour votre inscription à notre newsletter',
  welcome: 'Bienvenue',
  interestContent:
    'Merci de votre inscription à notre newsletter. Nous avons bien noté votre intérêt pour :',
  newsletterContent:
    'Nous vous tiendrons informé des dernières actualités et des fonctionnalités que vous souhaitez voir.',
  profile: 'Le profil de Liam',
  footerContent:
    'Vous recevez cet email comme vous vous êtes inscrit à notre newsletter.',
} as NewsletterConfirmProps;

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  background: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0 0 0',
  width: '100%',
};

const logo = {
  width: '120px',
};

const content = {
  padding: '20px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#555',
  fontSize: '16px',
  margin: '24px 0',
  lineHeight: '1.5',
};

const button = {
  backgroundColor: '#e00707',
  borderRadius: 3,
  color: '#FFF',
  fontWeight: 'bold',
  border: '1px solid rgb(0,0,0, 0.1)',
  cursor: 'pointer',
  padding: '12px 30px',
};

const footer = {
  textAlign: 'center' as const,
  padding: '10px',
  borderTop: '1px solid #ddd',
};

const footerText = {
  color: '#777',
  fontSize: '14px',
  margin: '10px 0',
};
