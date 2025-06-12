import ContactPageTemplate from "@/components/contact/contact-page-template";
import GeneralForm from "@/components/contact/general-form";
import { auth } from "@/lib/auth";

export default async function ContactPage() {
  const session = await auth();

  const isAuth = !!session;
  return (
    <ContactPageTemplate
      title="Contact Us"
      description="We're here to help! Whether you have questions, feedback, or need support, our team is ready to assist you with your BlueFrog marketplace experience."
    >
      <GeneralForm isAuth={isAuth} email={session?.user.email} />
    </ContactPageTemplate>
  );
}
