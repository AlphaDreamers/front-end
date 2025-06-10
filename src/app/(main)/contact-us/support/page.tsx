import ContactPageTemplate from "@/components/contact/contact-page-template";
import { me } from "@/lib/actions/auth";
import SupportForm from "@/components/contact/support-form";

export default async function SupportContactPage() {
  const {user,} = await me();

  const isAuth = !!user?.isVerified;
  return (
    <ContactPageTemplate
      title="Get Technical Support"
      description="Need help with your account or technical issues? Our support team is here to assist you. Please fill out the form below to get started."
    >
      <SupportForm isAuth={isAuth} email={user?.email} />
    </ContactPageTemplate>
  );
}
