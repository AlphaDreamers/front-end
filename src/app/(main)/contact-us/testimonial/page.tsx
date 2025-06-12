import ContactPageTemplate from "@/components/contact/contact-page-template";

import TestimonialForm from "@/components/contact/testimonial-form";
import { auth } from "@/lib/auth";

export default async function TestimonialContactPage() {
  const session = await auth();

  const isAuth = !!session;

  return (
    <ContactPageTemplate
      title="Share Your Experience"
      description="We'd love to hear about your positive experience with BlueFrog marketplace. Please fill out the form below to share your testimonial."
    >
      <TestimonialForm isAuth={isAuth} email={session?.user.email} />
    </ContactPageTemplate>
  );
}
