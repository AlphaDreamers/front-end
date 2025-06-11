import ContactPageTemplate from "@/components/contact/contact-page-template";
import { me } from "@/lib/actions/auth";
import TestimonialForm from "@/components/contact/testimonial-form";

export default async function TestimonialContactPage() {
  const {user,} = await me();

  const isAuth = !!user?.isVerified;

  return (
    <ContactPageTemplate
      title="Share Your Experience"
      description="We'd love to hear about your positive experience with BlueFrog marketplace. Please fill out the form below to share your testimonial."
    >
      <TestimonialForm isAuth={isAuth} email={user?.email} />
    </ContactPageTemplate>
  );
}
