import { redirect } from "next/navigation";
import { me } from "@/lib/actions/auth";
import OrdersReportPage from "@/components/orders/order_report_generation";

export default async function ReportsPage() {
    const { user, error } = await me();

    if (!user?.isVerified) {
        redirect(
            `/sign-in?callback-url=${encodeURIComponent(`/dashboard/reports`)}&error=${encodeURIComponent(
                error === "INVALID_TOKEN"
                    ? "Invalid token. Please log in again"
                    : error === "TOKEN_EXPIRED"
                        ? "Your session has expired. Please log in again"
                        : "You must be logged in to access this page"
            )}`
        );
    }

    return <OrdersReportPage user={user} />;
}