// src/components/email-templates/password-changed-email.tsx
import React from "react";

interface PasswordChangedEmailTemplateProps {
  email: string;
  firstName?: string;
  changeTime?: string;
  ipAddress?: string;
  device?: string;
}

const PasswordChangedEmailTemplate: React.FC<
  Readonly<PasswordChangedEmailTemplateProps>
> = ({ email, firstName, changeTime, ipAddress, device }) => {
  const currentTime = changeTime || new Date().toLocaleString();

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
        {/* Header with success color */}
        <tr>
          <td
            style={{
              backgroundColor: "#059669",
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
              Password Changed Successfully
            </h1>
            <p
              style={{
                color: "#a7f3d0",
                fontSize: "14px",
                margin: "8px 0 0 0",
              }}
            >
              Blue Frog Account Security
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
              {firstName ? `Hi ${firstName},` : "Password Update Confirmed"}
            </h2>

            <p
              style={{
                color: "#4b5563",
                fontSize: "16px",
                margin: "0 0 30px 0",
                textAlign: "center",
              }}
            >
              Your Blue Frog account password has been successfully changed.
              Your account is now secured with your new password.
            </p>

            {/* Success Notice */}
            <div
              style={{
                backgroundColor: "#d1fae5",
                border: "1px solid #a7f3d0",
                borderRadius: "6px",
                padding: "16px",
                margin: "0 0 30px 0",
              }}
            >
              <p
                style={{
                  color: "#065f46",
                  fontSize: "14px",
                  margin: "0",
                  fontWeight: "600",
                }}
              >
                ✅ Password Updated
              </p>
              <p
                style={{
                  color: "#065f46",
                  fontSize: "14px",
                  margin: "8px 0 0 0",
                  lineHeight: "1.5",
                }}
              >
                Your password was successfully changed on {currentTime}. You can
                now use your new password to sign in to your account.
              </p>
            </div>

            {/* Change Details */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                padding: "20px",
                margin: "0 0 30px 0",
              }}
            >
              <h3
                style={{
                  color: "#374151",
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "0 0 12px 0",
                }}
              >
                Change Details
              </h3>
              <table style={{ width: "100%" }}>
                <tr>
                  <td
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      padding: "4px 0",
                      width: "30%",
                    }}
                  >
                    Account:
                  </td>
                  <td
                    style={{
                      color: "#374151",
                      fontSize: "14px",
                      padding: "4px 0",
                      fontWeight: "500",
                    }}
                  >
                    {email}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      padding: "4px 0",
                    }}
                  >
                    Time:
                  </td>
                  <td
                    style={{
                      color: "#374151",
                      fontSize: "14px",
                      padding: "4px 0",
                      fontWeight: "500",
                    }}
                  >
                    {currentTime}
                  </td>
                </tr>
                {ipAddress && (
                  <tr>
                    <td
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        padding: "4px 0",
                      }}
                    >
                      IP Address:
                    </td>
                    <td
                      style={{
                        color: "#374151",
                        fontSize: "14px",
                        padding: "4px 0",
                        fontWeight: "500",
                      }}
                    >
                      {ipAddress}
                    </td>
                  </tr>
                )}
                {device && (
                  <tr>
                    <td
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        padding: "4px 0",
                      }}
                    >
                      Device:
                    </td>
                    <td
                      style={{
                        color: "#374151",
                        fontSize: "14px",
                        padding: "4px 0",
                        fontWeight: "500",
                      }}
                    >
                      {device}
                    </td>
                  </tr>
                )}
              </table>
            </div>

            {/* Security Notice */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #fbbf24",
                borderRadius: "6px",
                padding: "16px",
                margin: "0 0 30px 0",
              }}
            >
              <p
                style={{
                  color: "#92400e",
                  fontSize: "14px",
                  margin: "0",
                  fontWeight: "600",
                }}
              >
                🔒 Didn&apos;t make this change?
              </p>
              <p
                style={{
                  color: "#92400e",
                  fontSize: "14px",
                  margin: "8px 0 0 0",
                  lineHeight: "1.5",
                }}
              >
                If you didn&apos;t change your password, your account may have been
                compromised. Please contact our support team immediately to
                secure your account.
              </p>
            </div>

            {/* Call to Action */}
            <div style={{ textAlign: "center", margin: "0 0 30px 0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "14px 30px",
                  borderRadius: "6px",
                  marginRight: "12px",
                }}
              >
                Sign In Now
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/support`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#ffffff",
                  color: "#059669",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "14px 30px",
                  borderRadius: "6px",
                  border: "2px solid #059669",
                }}
              >
                Contact Support
              </a>
            </div>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "0",
                textAlign: "center",
              }}
            >
              For your security, we recommend using a strong, unique password
              and enabling two-factor authentication.
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
              This email was sent to {email}
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
                href={`${process.env.NEXT_PUBLIC_APP_URL}/support`}
                style={{
                  color: "#059669",
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

export default PasswordChangedEmailTemplate;
