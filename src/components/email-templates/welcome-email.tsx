// src/components/email-templates/welcome-email.tsx
import React from "react";

interface WelcomeEmailTemplateProps {
  username: string;
  firstName: string;
}

const WelcomeEmailTemplate: React.FC<Readonly<WelcomeEmailTemplateProps>> = ({
  username,
  firstName,
}) => {
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
        {/* Celebratory Header */}
        <tr>
          <td
            style={{
              background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)",
              padding: "60px 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                margin: "0 0 20px 0",
              }}
            >
              🎉
            </div>
            <h1
              style={{
                color: "#ffffff",
                fontSize: "32px",
                fontWeight: "700",
                margin: "0",
                letterSpacing: "-1px",
              }}
            >
              Welcome to Blue Frog!
            </h1>
            <p
              style={{
                color: "#e9d5ff",
                fontSize: "16px",
                margin: "12px 0 0 0",
              }}
            >
              Your account is ready to go
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
              }}
            >
              Hey {firstName}! 👋
            </h2>

            <p
              style={{
                color: "#4b5563",
                fontSize: "16px",
                margin: "0 0 30px 0",
                lineHeight: "1.6",
              }}
            >
              Congratulations on joining Blue Frog, the premier Solana services
              marketplace! Your username <strong>@{username}</strong> is now
              active and ready to explore our vibrant community of creators and
              clients.
            </p>

            {/* Quick Start Guide */}
            <div
              style={{
                backgroundColor: "#faf5ff",
                border: "1px solid #e9d5ff",
                borderRadius: "8px",
                padding: "24px",
                margin: "0 0 30px 0",
              }}
            >
              <h3
                style={{
                  color: "#5b21b6",
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                }}
              >
                🚀 Quick Start Guide
              </h3>

              <div style={{ marginBottom: "16px" }}>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/profile/edit`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6b7280",
                    textDecoration: "none",
                    padding: "12px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "20px", marginRight: "12px" }}>
                    ✏️
                  </span>
                  <div>
                    <strong style={{ color: "#374151", display: "block" }}>
                      Complete Your Profile
                    </strong>
                    <span style={{ fontSize: "14px" }}>
                      Add your skills, portfolio, and bio
                    </span>
                  </div>
                </a>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/explore`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6b7280",
                    textDecoration: "none",
                    padding: "12px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "20px", marginRight: "12px" }}>
                    🔍
                  </span>
                  <div>
                    <strong style={{ color: "#374151", display: "block" }}>
                      Explore Services
                    </strong>
                    <span style={{ fontSize: "14px" }}>
                      Browse gigs from talented creators
                    </span>
                  </div>
                </a>
              </div>

              <div>
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/create-gig`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#6b7280",
                    textDecoration: "none",
                    padding: "12px",
                    backgroundColor: "#ffffff",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ fontSize: "20px", marginRight: "12px" }}>
                    💼
                  </span>
                  <div>
                    <strong style={{ color: "#374151", display: "block" }}>
                      Create Your First Gig
                    </strong>
                    <span style={{ fontSize: "14px" }}>
                      Start earning with your skills
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Main CTA */}
            <div style={{ textAlign: "center", margin: "0 0 30px 0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#5b21b6",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "16px 40px",
                  borderRadius: "6px",
                }}
              >
                Go to Dashboard
              </a>
            </div>

            {/* Platform Benefits */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  color: "#374151",
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                }}
              >
                Why Blue Frog?
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                <div style={{ flex: "1", minWidth: "140px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    ⚡
                  </div>
                  <strong style={{ color: "#374151", fontSize: "14px" }}>
                    Fast Payments
                  </strong>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Instant Solana transactions
                  </p>
                </div>
                <div style={{ flex: "1", minWidth: "140px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    🛡️
                  </div>
                  <strong style={{ color: "#374151", fontSize: "14px" }}>
                    Secure Platform
                  </strong>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Escrow protection built-in
                  </p>
                </div>
                <div style={{ flex: "1", minWidth: "140px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                    🌐
                  </div>
                  <strong style={{ color: "#374151", fontSize: "14px" }}>
                    Global Reach
                  </strong>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Connect worldwide
                  </p>
                </div>
              </div>
            </div>
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
                color: "#374151",
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 12px 0",
              }}
            >
              Need help getting started?
            </p>
            <p style={{ margin: "0 0 20px 0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/help`}
                style={{
                  color: "#5b21b6",
                  fontSize: "14px",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Help Center
              </a>
              <span style={{ color: "#d1d5db" }}>•</span>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/community`}
                style={{
                  color: "#5b21b6",
                  fontSize: "14px",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Community
              </a>
              <span style={{ color: "#d1d5db" }}>•</span>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/tutorials`}
                style={{
                  color: "#5b21b6",
                  fontSize: "14px",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Tutorials
              </a>
            </p>
            <p
              style={{
                color: "#6b7280",
                fontSize: "12px",
                margin: "0",
              }}
            >
              © {new Date().getFullYear()} Blue Frog. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default WelcomeEmailTemplate;
