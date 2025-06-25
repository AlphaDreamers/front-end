import { BestPractices } from "@/components/help/best-practices";
import { BorderedCard } from "@/components/help/bordered-card";
import { FeatureGrid } from "@/components/help/feature-grid";
import { SectionGrid } from "@/components/help/section-grid";
import { TipBox } from "@/components/help/tip-box";
import { HelpPageTemplate } from "@/components/templates/help-page-template";
import { Bell, Shield, User } from "lucide-react";

export default function AccountManagement() {
  const accountFeatures = [
    {
      icon: User,
      bgColor: "bg-blue-500",
      title: "Profile Management",
      description: "Showcase your skills",
    },
    {
      icon: Bell,
      bgColor: "bg-green-500",
      title: "Notifications",
      description: "Stay informed",
    },
    {
      icon: Shield,
      bgColor: "bg-red-500",
      title: "Security",
      description: "Protect your account",
    },
  ];

  const profileSections = [
    {
      title: "Basic Information:",
      color: "text-primary",
      items: [
        {
          title: "Profile Picture",
          description:
            "Upload a professional headshot (recommended: 400x400px)",
        },
        {
          title: "Display Name",
          description: "How others will see your name on the platform",
        },
        {
          title: "Professional Title",
          description: "Brief description of your expertise",
        },
        {
          title: "Bio/Description",
          description: "Detailed overview of your skills and experience",
        },
      ],
    },
    {
      title: "Professional Details:",
      color: "text-secondary",
      items: [
        {
          title: "Skills & Expertise",
          description: "Add relevant skills and proficiency levels",
        },
        {
          title: "Portfolio",
          description: "Showcase your best work samples",
        },
        {
          title: "Certifications",
          description: "Add relevant certifications and credentials",
        },
        {
          title: "Availability",
          description: "Set your working hours and availability status",
        },
      ],
    },
  ];

  return (
    <HelpPageTemplate
      title="Account Management"
      description="Manage your profile, settings, and security"
    >
      <BorderedCard
        color="indigo"
        icon={User}
        title="Account Management Basics"
      >
        <p className="text-muted-foreground leading-relaxed mb-4">
          Your account is the foundation of your experience on our platform.
          Proper account management ensures security, helps you build
          credibility, and allows you to customize your experience. From profile
          settings to security configurations, managing your account effectively
          is key to success.
        </p>
        <FeatureGrid features={accountFeatures} columns={3} />
      </BorderedCard>

      <BorderedCard
        color="blue"
        icon={User}
        title="Profile Settings"
        description="Keep your profile updated and professional"
      >
        <SectionGrid sections={profileSections} />
        <TipBox title="Profile Optimization Tips" className="mt-6">
          <BestPractices
            doItems={{
              title: "Best Practices",
              items: [
                "Use a clear, professional profile photo",
                "Write a compelling bio that highlights your unique value",
                "Keep your skills list relevant and up-to-date",
                "Regularly update your portfolio with recent work",
              ],
            }}
            dontItems={{
              title: "Avoid",
              items: [
                "Using generic or unprofessional photos",
                "Leaving sections incomplete or outdated",
                "Overstating skills or experience",
                "Using inappropriate language or content",
              ],
            }}
          />
        </TipBox>
      </BorderedCard>
    </HelpPageTemplate>
  );
}
