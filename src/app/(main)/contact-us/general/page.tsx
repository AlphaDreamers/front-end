import { me } from "@/lib/actions/auth";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import GeneralForm from "@/components/contact/general-form";

export default async function ContactPage() {
  const {user,} = await me();

  const isAuth = !!user?.isVerified;
  return (
    <ContactPageTemplate
      title="Contact Us"
      description="We're here to help! Whether you have questions, feedback, or need support, our team is ready to assist you with your BlueFrog marketplace experience."
    >
      <GeneralForm isAuth={isAuth} email={user?.email} />
    </ContactPageTemplate>
  );
}
