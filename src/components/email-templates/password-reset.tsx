import React from "react";

interface PasswordResetEmailTemplateProps {
  code: string;
  email: string;
  firstName?: string;
}

const PasswordResetEmailTemplate: React.FC<Readonly<PasswordResetEmailTemplateProps>> = ({
  code,
  email,
  firstName,
}) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${encodeURIComponent(email)}&code=${code}`;

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
        <tr>
          <td
            style={{
              backgroundColor: "#dc2626",
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
              Password Reset Request
            </h1>
          </td>
        </tr>
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
              {firstName ? `Hi ${firstName},` : "Password Reset"}
            </h2>
            <p
              style={{
                color: "#4b5563",
                fontSize: "16px",
                margin: "0 0 30px 0",
                textAlign: "center",
              }}
            >
              Click below to reset your Blue Frog account password.
            </p>
            <div style={{ textAlign: "center", margin: "0 0 30px 0" }}>
              <a
                href={resetUrl}
                style={{
                  display: "inline-block",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "14px 30px",
                  borderRadius: "6px",
                }}
              >
                Reset Password
              </a>
            </div>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "0 0 20px 0",
                textAlign: "center",
              }}
            >
              This link expires in 1 hour. If you didn’t request this, contact support.
            </p>
          </td>
        </tr>
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
              Sent to {email}
            </p>
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
                href={`${process.env.NEXT_PUBLIC_APP_URL}/contact-us/support`}
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Contact Support
              </a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default PasswordResetEmailTemplate;