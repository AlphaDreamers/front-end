import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1
            className="text-3xl font-bold text-white mb-2"
            aria-label="Terms of Service heading"
          >
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400">Last Updated: June 5, 2025</p>
        </header>

        {/* Content */}
        <main className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              These terms govern your use of BlueFrog, a Solana-based freelance
              marketplace platform. By accessing or using our services, you
              agree to be bound by these Terms of Service. If you disagree with
              any part of the terms, you may not access the service. BlueFrog
              reserves the right to modify these terms at any time, and such
              modifications shall be effective immediately upon posting.
            </p>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              User Responsibilities
            </h2>
            <p className="text-base text-gray-200 leading-relaxed mb-4">
              You agree to provide accurate information when creating an account
              and to maintain the security of your account credentials. As a
              BlueFrog user, you are responsible for:
            </p>
            <ul className="text-base text-gray-200 leading-relaxed space-y-2 ml-6">
              <li>
                • Maintaining the confidentiality of your account and wallet
                information
              </li>
              <li>• All activities that occur under your account</li>
              <li>
                • Ensuring your content does not violate intellectual property
                rights
              </li>
              <li>• Complying with all applicable laws and regulations</li>
              <li>
                • Conducting yourself professionally and respectfully on the
                platform
              </li>
            </ul>
          </section>

          {/* Service Transactions */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              Service Transactions
            </h2>
            <p className="text-base text-gray-200 leading-relaxed">
              Buyers and sellers must fulfill their obligations for all
              transactions initiated on BlueFrog. Sellers must deliver services
              as described and within the agreed timeframe. Buyers must provide
              clear requirements and compensate sellers as agreed. BlueFrog
              facilitates these transactions but is not responsible for the
              quality, safety, or legality of services offered. All service
              descriptions must be accurate and complete. Misrepresentation may
              result in account suspension.
            </p>
          </section>

          {/* Payments and Payouts */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              Payments and Payouts
            </h2>
            <p className="text-base text-gray-200 leading-relaxed">
              Transactions on BlueFrog use the Solana blockchain for processing
              payments. Funds are held in escrow until service completion.
              BlueFrog charges a platform fee on each transaction, deducted
              automatically. Users are responsible for any blockchain
              transaction fees. Payouts to sellers are processed within 24 hours
              of service acceptance. All transactions are final and recorded on
              the Solana blockchain. Users are responsible for their tax
              obligations related to platform earnings.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              Dispute Resolution
            </h2>
            <p className="text-base text-gray-200 leading-relaxed">
              Disputes between buyers and sellers are handled through our
              mediation process. Users agree to participate in good faith to
              resolve conflicts. BlueFrog will review evidence from both parties
              and make a determination based on platform policies and
              transaction history. For unresolved disputes, users may escalate
              to arbitration as outlined in our Dispute Resolution Policy.
              BlueFrog&apos;s decision is final in matters related to platform
              usage and fund distribution.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Termination</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              Accounts may be terminated for violations of these terms,
              fraudulent activity, or prolonged inactivity. BlueFrog reserves
              the right to suspend or terminate accounts at our discretion. Upon
              termination, your right to use the service will cease immediately.
              All provisions of the Terms which by their nature should survive
              termination shall survive, including ownership provisions,
              warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-base text-gray-200 leading-relaxed">
              If you have questions about these Terms of Service or need
              assistance with your account, please reach us at{" "}
              <a
                href="mailto:support@bluefrog.com"
                className="text-violet-400 hover:underline"
                aria-label="Contact support email"
              >
                support@bluefrog.com
              </a>
              . Our support team is available to address your concerns and
              provide guidance on platform usage. For urgent matters, please
              include &ldquo;URGENT&ldquo; in your email subject line.
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
              href="/privacy-policy"
              className="text-violet-400 hover:underline transition-colors"
              aria-label="View privacy policy"
            >
              Privacy Policy
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
