import React from "react";

interface PasswordResetEmailTemplateProps {
  code: string;
}

const PasswordResetEmailTemplate: React.FC<
  Readonly<PasswordResetEmailTemplateProps>
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
        Reset Your Password
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "16px",
          lineHeight: "24px",
        }}
      >
        We received a request to reset your password. Please use the
        verification code below to continue with the password reset process:
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
        This code will expire in 24 hours. If you didn't request a password
        reset, please ignore this email or contact support if you have concerns
        about your account security.
      </p>

      <div
        style={{
          backgroundColor: "#fff9e6",
          border: "1px solid #ffe6b3",
          borderRadius: "5px",
          margin: "20px 0",
          padding: "10px 15px",
        }}
      >
        <p
          style={{
            color: "#664d03",
            fontSize: "14px",
            margin: "0",
          }}
        >
          For your security, never share this code with anyone.
        </p>
      </div>

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

export default PasswordResetEmailTemplate;
