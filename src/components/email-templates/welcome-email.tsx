import React from "react";

interface WelcomeEmailTemplateProps {
  username: string;
}

const WelcomeEmailTemplate: React.FC<Readonly<WelcomeEmailTemplateProps>> = ({
  username,
}) => {
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "#333",
          fontSize: "24px",
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        Welcome to Your App!
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        Hello {username},
      </p>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        Thank you for verifying your email address and joining our community.
        Your account is now fully activated and ready to use.
      </p>

      <div
        style={{
          margin: "30px 0",
          textAlign: "center",
        }}
      >
        <a
          href="https://your-app-url.com/dashboard"
          style={{
            backgroundColor: "#4f46e5",
            borderRadius: "5px",
            color: "#fff",
            display: "inline-block",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "12px 20px",
            textDecoration: "none",
          }}
        >
          Get Started
        </a>
      </div>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        Here are a few things you can do with your new account:
      </p>

      <div
        style={{
          backgroundColor: "#f9fafb",
          border: "1px solid #eee",
          borderRadius: "5px",
          margin: "20px 0",
          padding: "15px",
        }}
      >
        <p
          style={{
            color: "#555",
            fontSize: "15px",
            margin: "10px 0",
          }}
        >
          ✓ Complete your profile information
        </p>
        <p
          style={{
            color: "#555",
            fontSize: "15px",
            margin: "10px 0",
          }}
        >
          ✓ Explore our available features
        </p>
        <p
          style={{
            color: "#555",
            fontSize: "15px",
            margin: "10px 0",
          }}
        >
          ✓ Connect with other users
        </p>
      </div>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        If you have any questions or need assistance, please don't hesitate to{" "}
        <a href="mailto:support@your-app.com" style={{ color: "#4f46e5" }}>
          contact our support team
        </a>
        .
      </p>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        We're excited to have you on board!
      </p>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          fontWeight: "bold",
          marginTop: "30px",
        }}
      >
        The Your App Team
      </p>

      <div
        style={{
          borderTop: "1px solid #eee",
          color: "#8898aa",
          fontSize: "12px",
          marginTop: "30px",
          paddingTop: "20px",
          textAlign: "center",
        }}
      >
        &copy; {new Date().getFullYear()} Your App. All rights reserved.
        <br />
        <a href="https://your-app-url.com/privacy" style={{ color: "#8898aa" }}>
          Privacy Policy
        </a>{" "}
        •{" "}
        <a href="https://your-app-url.com/terms" style={{ color: "#8898aa" }}>
          Terms of Service
        </a>
      </div>
    </div>
  );
};

export default WelcomeEmailTemplate;
