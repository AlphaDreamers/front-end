import { getKeyValueOrders } from "@/lib/actions/order";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import ComplaintForm from "@/components/contact/complaint-form";
import { auth } from "@/lib/auth";

export default async function ContactPage() {
  const session = await auth();
  const isAuth = !!session;

  const orders = session?.user.id
    ? await getKeyValueOrders({
        where: {
          OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <ContactPageTemplate
      title="File a Complaint"
      description="If you have a complaint regarding a transaction or user behavior, please fill out the form below. Our team will review your complaint and take appropriate action."
    >
      <ComplaintForm
        isAuth={isAuth}
        email={session?.user.email}
        orders={orders}
      />
    </ContactPageTemplate>
  );
}
