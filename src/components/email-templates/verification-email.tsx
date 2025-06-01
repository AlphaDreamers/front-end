// src/components/email-templates/verification-email.tsx
import React from "react";

interface VerificationEmailTemplateProps {
  code: string;
  firstName: string;
}

const VerificationEmailTemplate: React.FC<
  Readonly<VerificationEmailTemplateProps>
> = ({ code, firstName }) => {
  return (
    <div
      style={{
        backgroundColor: "#f6f9fc",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#333",
        margin: "0",
        padding: "0",
      }}
    >
      <table
        cellPadding="0"
        cellSpacing="0"
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          marginTop: "40px",
          marginBottom: "40px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <tr>
          <td
            style={{
              backgroundColor: "#5b21b6",
              padding: "40px 0",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "600",
                margin: "0",
                letterSpacing: "-0.5px",
              }}
            >
              Blue Frog
            </h1>
            <p
              style={{
                color: "#e9d5ff",
                fontSize: "14px",
                margin: "8px 0 0 0",
              }}
            >
              Solana Services Marketplace
            </p>
          </td>
        </tr>

        {/* Body */}
        <tr>
          <td style={{ padding: "40px 30px" }}>
            <h2
              style={{
                color: "#1a1a1a",
                fontSize: "24px",
                fontWeight: "600",
                margin: "0 0 20px 0",
                textAlign: "center",
              }}
            >
              Welcome to Blue Frog, {firstName}!
            </h2>

            <p
              style={{
                color: "#4b5563",
                fontSize: "16px",
                margin: "0 0 30px 0",
                textAlign: "center",
              }}
            >
              We&apos;re excited to have you join our community. To get started,
              please verify your email address using the code below:
            </p>

            {/* Verification Code Box */}
            <div
              style={{
                backgroundColor: "#f3f4f6",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "30px",
                textAlign: "center",
                margin: "0 0 30px 0",
              }}
            >
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  margin: "0 0 10px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Your verification code
              </p>
              <div
                style={{
                  color: "#5b21b6",
                  fontSize: "36px",
                  fontWeight: "700",
                  letterSpacing: "8px",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {code}
              </div>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "12px",
                  margin: "10px 0 0 0",
                }}
              >
                This code expires in 24 hours
              </p>
            </div>

            {/* Call to Action */}
            <div style={{ textAlign: "center", margin: "0 0 30px 0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/verify-email?code=${code}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#5b21b6",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "14px 30px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
              >
                Verify Email Address
              </a>
            </div>

            {/* Help Text */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #fde68a",
                borderRadius: "6px",
                padding: "16px",
                margin: "0 0 20px 0",
              }}
            >
              <p
                style={{
                  color: "#92400e",
                  fontSize: "14px",
                  margin: "0",
                  lineHeight: "1.5",
                }}
              >
                <strong>Having trouble?</strong> Make sure to check your spam
                folder, or copy and paste the code manually on our verification
                page.
              </p>
            </div>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "0",
                textAlign: "center",
              }}
            >
              If you didn&apos;t create an account with Blue Frog, you can
              safely ignore this email.
            </p>
          </td>
        </tr>

        {/* Footer */}
        <tr>
          <td
            style={{
              backgroundColor: "#f9fafb",
              padding: "30px",
              textAlign: "center",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                fontSize: "12px",
                margin: "0 0 10px 0",
              }}
            >
              © {new Date().getFullYear()} Blue Frog. All rights reserved.
            </p>
            <p style={{ margin: "0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/help`}
                style={{
                  color: "#5b21b6",
                  fontSize: "12px",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Help Center
              </a>
              <span style={{ color: "#d1d5db" }}>•</span>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/privacy`}
                style={{
                  color: "#5b21b6",
                  fontSize: "12px",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Privacy Policy
              </a>
              <span style={{ color: "#d1d5db" }}>•</span>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/terms`}
                style={{
                  color: "#5b21b6",
                  fontSize: "12px",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Terms of Service
              </a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default VerificationEmailTemplate;
