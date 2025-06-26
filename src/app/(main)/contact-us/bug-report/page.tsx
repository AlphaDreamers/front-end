import ContactPageTemplate from "@/components/contact/contact-page-template";
import { auth } from "@/lib/auth";
import BugReportForm from "@/components/contact/bug-report-form";

export default async function ContactPage() {
  const session = await auth();
  const isAuth = !!session;

  return (
    <ContactPageTemplate
      title="Bug Report"
      description="Report bugs or issues with the BlueFrog marketplace to help us improve"
    >
      <BugReportForm isAuth={isAuth} email={session?.user.email} />
    </ContactPageTemplate>
  );
}
