import React from "react";

interface VerificationEmailTemplateProps {
  code: string;
}

const VerificationEmailTemplate: React.FC<
  Readonly<VerificationEmailTemplateProps>
> = ({ code }) => {
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
        Verify your email address
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        Thank you for signing up! Please use the verification code below to
        confirm your email address:
      </p>

      <div
        style={{
          backgroundColor: "#f4f7ff",
          border: "1px solid #e1e8ff",
          borderRadius: "5px",
          margin: "20px 0",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#4263eb",
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "5px",
            margin: "10px 0",
          }}
        >
          {code}
        </p>
      </div>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        This code will expire in 24 hours. If you didn't request this code, you
        can safely ignore this email.
      </p>

      <p
        style={{
          color: "#8898aa",
          fontSize: "12px",
          marginTop: "30px",
          textAlign: "center",
        }}
      >
        &copy; {new Date().getFullYear()} Your App. All rights reserved.
      </p>
    </div>
  );
};

export default VerificationEmailTemplate;
