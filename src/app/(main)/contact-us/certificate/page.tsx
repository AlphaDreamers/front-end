import ContactPageTemplate from "@/components/contact/contact-page-template";
import { auth } from "@/lib/auth";
import CertificateSubmissionForm from "@/components/contact/certificate-submission-form";
import { prisma } from "@/lib/prisma";

export default async function ContactPage() {
  const session = await auth();
  const isAuth = !!session;

  const badges = await prisma.badgeMilestone.findMany({
    select: {
      badge: {
        select: {
          id: true,
          title: true,
        },
      },
      tier: true,
    },
  });

  return (
    <ContactPageTemplate
      title="Certificate Submission"
      description="Submit your certificates for verification and earn badges"
    >
      <CertificateSubmissionForm
        isAuth={isAuth}
        email={session?.user.email}
        badges={badges.map((badge) => ({
          value: badge.badge.id,
          label: `${badge.badge.title} - Tier ${badge.tier}`,
        }))}
      />
    </ContactPageTemplate>
  );
}
