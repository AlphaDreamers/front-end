import ContactPageTemplate from "@/components/contact/contact-page-template";
import { me } from "@/lib/actions/auth";
import FeedbackForm from "@/components/contact/feedback-form";

export default async function ContactPage() {
  const {user,} = await me();

  const isAuth = !!user?.isVerified;
  return (
    <ContactPageTemplate
      title="Share Your Feedback"
      description="We value your input! Please share your feedback to help us improve the BlueFrog marketplace experience."
    >
      <FeedbackForm isAuth={isAuth} email={user?.email} />
    </ContactPageTemplate>
  );
}
