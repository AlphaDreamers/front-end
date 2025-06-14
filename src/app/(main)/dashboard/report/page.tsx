import { redirect } from "next/navigation";
import OrdersReportPage from "@/components/orders/order_report_generation";
import { auth } from "@/lib/auth";

export default async function ReportsPage() {
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/reports`)}`
    );
  }

  return <OrdersReportPage user={session.user} />;
}
