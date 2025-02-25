import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

import * as React from 'react';

interface InvitationEmailProps {
  subject: string;
  url: string;
  title?: string;
  description?: string;
  cta?: string;
  desc?: string;
}

const baseUrl = process.env.APP_DOMAIN ? `${process.env.APP_DOMAIN}` : '';
const appName = process.env.APP_NAME ? `${process.env.APP_NAME}` : '';
const appDomain = process.env.APP_DOMAIN ? `${process.env.APP_DOMAIN}` : '';

export default function InvitationEmail({
  subject,
  title,
  description,
  desc,
  cta,
  url,
}: InvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row>
              <Img
                style={image}
                height={200}
                width="100%"
                src="https://images.pexels.com/photos/2882688/pexels-photo-2882688.jpeg?auto=compress&crop=center&format=crop&h=00&w=600"
              />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: '0' }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {title}
                </Heading>
                <Hr />
                <Text style={{ ...paragraph, textAlign: 'center' }}>
                  {description}
                </Text>
                <Hr />
                <Text style={{ ...paragraph, textAlign: 'center' }}>
                  {desc}
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: '0' }}>
              <Column style={containerButton} colSpan={2}>
                <Button href={url} style={button}>
                  {cta}
                </Button>
              </Column>
            </Row>
          </Section>
        </Container>
        <Section style={containerImageFooter}>
          <Row>
            <Column
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Img width={80} src={`${baseUrl}/images/brand.png`} />

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                  color: 'rgb(0,0,0, 0.7)',
                }}
              >
                © {new Date().getFullYear()} | {appName} |{appDomain}
              </Text>
            </Column>
          </Row>
        </Section>
      </Body>
    </Html>
  );
}

InvitationEmail.PreviewProps = {
  subject: 'Confirm your email address',
  title: 'Confirm your email address',
  description: 'To confirm your email address, click the button below.',
  desc: 'My personal note',
  cta: 'Confirm mail address',
  url: 'https://example.com',
} as InvitationEmailProps;

const main = {
  paddingTop: '40px',
  backgroundColor: '#fff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const containerButton = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
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

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
};

const image: React.CSSProperties = {
  maxWidth: '100%',
  objectFit: 'cover' as React.CSSProperties['objectFit'],
};

const boxInfos = {
  padding: '20px',
};

const containerImageFooter = {
  display: 'flex',
  justifyContent: 'center',
  padding: '45px 0 90px 0',
};
