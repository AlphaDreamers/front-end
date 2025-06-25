import ContactPageTemplate from "@/components/contact/contact-page-template";
import { auth } from "@/lib/auth";
import BugReportForm from "@/components/contact/bug-report-form";

export default async function ContactPage() {
  const session = await auth();
  const isAuth = !!session;

  return (
    <ContactPageTemplate
      title="File a Complaint"
      description="If you have a complaint regarding a transaction or user behavior, please fill out the form below. Our team will review your complaint and take appropriate action."
    >
      <BugReportForm isAuth={isAuth} email={session?.user.email} />
    </ContactPageTemplate>
  );
}
