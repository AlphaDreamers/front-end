import React from "react";

interface TransactionConfirmationBuyerProps {
  orderId: string;
}

const TransactionConfirmationBuyer: React.FC<
  Readonly<TransactionConfirmationBuyerProps>
> = ({ orderId }) => {
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
              background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)",
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
              💳 Order Confirmation
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
              }}
            >
              Order Placed
            </h2>
            <p
              style={{
                color: "#4b5563",
                fontSize: "16px",
                margin: "0 0 20px 0",
              }}
            >
              Your payment was successful. The seller will start working on your
              order soon.
            </p>
            <div style={{ textAlign: "center", margin: "0 0 30px 0" }}>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#5b21b6",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  textDecoration: "none",
                  padding: "14px 30px",
                  borderRadius: "6px",
                }}
              >
                View Order
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
              Questions? Contact the seller or support.
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
                color: "#374151",
                fontSize: "14px",
                fontWeight: "600",
                margin: "0 0 12px 0",
              }}
            >
              Need help?
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
                href={`${process.env.NEXT_PUBLIC_APP_URL}/contact-us/support`}
                style={{
                  color: "#5b21b6",
                  fontSize: "14px",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                Contact Support
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

export default TransactionConfirmationBuyer;
