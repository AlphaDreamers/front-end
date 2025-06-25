import ContactPageTemplate from "@/components/contact/contact-page-template";

import FeedbackForm from "@/components/contact/feedback-form";
import { auth } from "@/lib/auth";

export default async function ContactPage() {
  const session = await auth();

  const isAuth = !!session;
  return (
    <ContactPageTemplate
      title="Share Your Feedback"
      description="We value your input! Please share your feedback to help us improve the BlueFrog marketplace experience."
    >
      <FeedbackForm isAuth={isAuth} email={session?.user.email} />
    </ContactPageTemplate>
  );
}
