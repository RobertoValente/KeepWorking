import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button } from "@react-email/components";

export function ResetPasswordTemplate(props: {
    url: string;
}) {
    const { url } = props;

    return (
        <Html>
            <Head />
            <Preview>Reset your password</Preview>
            <Body style={{ backgroundColor: '#f4f4f4', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <Container>
                    <Section style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <Heading style={{ fontSize: '22px', marginBottom: '10px' }}>
                            Reset Password!
                        </Heading>
                        <Text style={{ fontSize: '16px', marginBottom: '20px', color: '#555555' }}>
                            Click below to reset your password.
                        </Text>
                        <Button href={url} style={{ backgroundColor: '#007BFF', color: '#ffffff', padding: '12px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
                            Reset
                        </Button>
                    </Section>

                    <Text style={{ fontSize: '12px', color: '#999999', textAlign: 'center', marginTop: '30px' }}>
                        You&apos;re receiving this email because you requested to reset password.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}