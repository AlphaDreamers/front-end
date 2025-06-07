"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactSuccessPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle
                className="w-20 h-20 text-green-500"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1
              className="text-3xl font-bold text-white"
              role="heading"
              aria-level={1}
            >
              Thank you for contacting us!
            </h1>
            <div className="w-16 h-1 bg-violet-600 mx-auto rounded-full"></div>
          </div>

          {/* Confirmation Message */}
          <div className="space-y-4 max-w-lg mx-auto">
            <p className="text-base text-gray-200 leading-relaxed">
              Your message has been received successfully, and we will get back
              to you as soon as possible. Our team typically responds within
              24-48 hours during business days.
            </p>
            <p className="text-sm text-gray-300">
              If your inquiry is urgent, please don&apos;t hesitate to reach out
              through our support channels.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/" aria-label="Return to BlueFrog marketplace homepage">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-lg font-medium transition-colors min-w-[160px]">
                Return to Home
              </Button>
            </Link>
            <Link
              href="/contact-us"
              aria-label="Submit another contact message"
            >
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors min-w-[160px]"
              >
                Send Another Message
              </Button>
            </Link>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mt-12">
            <h2 className="text-lg font-semibold text-white mb-3">
              What happens next?
            </h2>
            <div className="space-y-2 text-sm text-gray-300 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Our support team will review your message and determine the
                  appropriate response
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  You&apos;ll receive a response via email or through your
                  BlueFrog account notifications
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  For urgent matters, our team may reach out sooner than the
                  standard response time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/"
              className="text-violet-400 hover:underline transition-colors"
              aria-label="Navigate to homepage"
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
              href="/terms-of-service"
              className="text-violet-400 hover:underline transition-colors"
              aria-label="View terms of service"
            >
              Terms of Service
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              © 2024 BlueFrog Solana Freelance Marketplace. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
