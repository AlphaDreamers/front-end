import { ContactSupportCard } from "@/components/contact/contact-support-card";
import PageTemplate from "@/components/templates/page-template";

export default function PrivacyPolicy() {
  return (
    <PageTemplate
      title="Privacy Policy"
      description="Learn how BlueFrog collects, uses, and protects your personal data on our Solana-based freelance marketplace."
    >
      {/* Content */}
      <main className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-bold mb-4">Introduction</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            BlueFrog respects your privacy and is committed to protecting your
            personal data. This privacy policy explains how we collect, use, and
            safeguard your information when you use our Solana-based freelance
            marketplace platform. By using BlueFrog, you agree to the collection
            and use of information in accordance with this policy.
          </p>
        </section>

        {/* Data We Collect */}
        <section>
          <h2 className="text-xl font-bold mb-4">Data We Collect</h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            We collect information you provide directly to us, including:
          </p>
          <ul className="text-base text-muted-foreground leading-relaxed space-y-2 ml-6">
            <li>
              • Account details such as username, email address, and profile
              information
            </li>
            <li>• Solana wallet addresses for transaction processing</li>
            <li>
              • Service listings, project descriptions, and communication data
            </li>
            <li>• Payment and transaction history on the Solana blockchain</li>
            <li>
              • Usage data and analytics to improve our platform performance
            </li>
          </ul>
        </section>

        {/* How We Use Data */}
        <section>
          <h2 className="text-xl font-bold mb-4">How We Use Data</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            We use your data to process transactions securely on the Solana
            blockchain, facilitate communication between freelancers and
            clients, improve our services through analytics, provide customer
            support, and ensure platform security. We may also use your
            information to send important updates about our services and comply
            with legal obligations.
          </p>
        </section>

        {/* Data Sharing */}
        <section>
          <h2 className="text-xl font-bold mb-4">Data Sharing</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Your transaction data is recorded on the Solana blockchain, which is
            publicly accessible. We may share your information with service
            providers who assist in platform operations, law enforcement when
            required by law, and other users as necessary for marketplace
            functionality. We do not sell your personal information to third
            parties for marketing purposes.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-xl font-bold mb-4">Data Security</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including
            encryption, secure protocols, and regular security audits to protect
            your data. However, no method of transmission over the internet is
            100% secure. We leverage the security features of the Solana
            blockchain for transaction data and maintain strict access controls
            for personal information.
          </p>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-xl font-bold mb-4">User Rights</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            You have the right to access, update, or delete your personal data
            stored on our platform. You can modify your profile information,
            request data deletion (subject to legal and blockchain limitations),
            and opt out of non-essential communications. Note that blockchain
            transaction data cannot be deleted due to the immutable nature of
            distributed ledgers.
          </p>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            If you have questions about this Privacy Policy or how we handle
            your data, please reach us at{" "}
            <a
              href="mailto:support@bluefrog.com"
              className="text-violet-400 hover:underline"
              aria-label="Contact support email"
            >
              support@bluefrog.com
            </a>
            . We are committed to addressing your privacy concerns and will
            respond to inquiries within 48 hours.
          </p>
        </section>
      </main>

      <ContactSupportCard />
    </PageTemplate>
  );
}
