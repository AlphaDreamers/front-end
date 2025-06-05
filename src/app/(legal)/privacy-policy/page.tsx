import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1
            className="text-3xl font-bold text-white mb-2"
            aria-label="Privacy Policy heading"
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">Last Updated: June 5, 2025</p>
        </header>

        {/* Content */}
        <main className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              BlueFrog respects your privacy and is committed to protecting your
              personal data. This privacy policy explains how we collect, use,
              and safeguard your information when you use our Solana-based
              freelance marketplace platform. By using BlueFrog, you agree to
              the collection and use of information in accordance with this
              policy.
            </p>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              Data We Collect
            </h2>
            <p className="text-base text-gray-200 leading-relaxed mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="text-base text-gray-200 leading-relaxed space-y-2 ml-6">
              <li>
                • Account details such as username, email address, and profile
                information
              </li>
              <li>• Solana wallet addresses for transaction processing</li>
              <li>
                • Service listings, project descriptions, and communication data
              </li>
              <li>
                • Payment and transaction history on the Solana blockchain
              </li>
              <li>
                • Usage data and analytics to improve our platform performance
              </li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              How We Use Data
            </h2>
            <p className="text-base text-gray-200 leading-relaxed">
              We use your data to process transactions securely on the Solana
              blockchain, facilitate communication between freelancers and
              clients, improve our services through analytics, provide customer
              support, and ensure platform security. We may also use your
              information to send important updates about our services and
              comply with legal obligations.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Data Sharing</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              Your transaction data is recorded on the Solana blockchain, which
              is publicly accessible. We may share your information with service
              providers who assist in platform operations, law enforcement when
              required by law, and other users as necessary for marketplace
              functionality. We do not sell your personal information to third
              parties for marketing purposes.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Data Security</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              We implement industry-standard security measures including
              encryption, secure protocols, and regular security audits to
              protect your data. However, no method of transmission over the
              internet is 100% secure. We leverage the security features of the
              Solana blockchain for transaction data and maintain strict access
              controls for personal information.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">User Rights</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              You have the right to access, update, or delete your personal data
              stored on our platform. You can modify your profile information,
              request data deletion (subject to legal and blockchain
              limitations), and opt out of non-essential communications. Note
              that blockchain transaction data cannot be deleted due to the
              immutable nature of distributed ledgers.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-base text-gray-200 leading-relaxed">
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

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <nav
            className="flex justify-center space-x-8"
            aria-label="Footer navigation"
          >
            <Link
              href="/"
              className="text-violet-400 hover:underline transition-colors"
              aria-label="Go to home page"
            >
              Home
            </Link>
            <Link
              href="/terms-of-service"
              className="text-violet-400 hover:underline transition-colors"
              aria-label="View terms of service"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-violet-400 hover:underline transition-colors"
              aria-label="Contact us"
            >
              Contact
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
