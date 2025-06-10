import { me } from "@/lib/actions/auth";
import { getKeyValueOrders } from "@/lib/actions/order";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import ComplaintForm from "@/components/contact/complaint-form";

export default async function ContactPage() {
  const {user,} = await me();
  const isAuth = !!user;

  const orders = user?.id
    ? await getKeyValueOrders({
        where: {
          OR: [{ buyerId: user.id }, { sellerId: user.id }],
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
      <ComplaintForm isAuth={isAuth} email={user?.email} orders={orders} />
    </ContactPageTemplate>
  );
}
