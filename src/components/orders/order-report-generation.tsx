"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Filter,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  getOrdersReport,
  downloadOrdersReportPDF,
  ReportFilters,
} from "@/lib/actions/report";

interface Order {
  id: string;
  status: string;
  deadline: string;
  createdAt: string;
  buyer: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  seller: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  gig?: {
    id: string;
    title: string;
  };
  package?: {
    title: string;
    price: number;
  };
  transaction?: {
    txId: string;
    amount: number;
  };
}

interface ReportSummary {
  totalOrders: number;
  totalRevenue: number;
  statusBreakdown: Record<string, number>;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
}

interface ReportData {
  orders: Order[];
  summary: ReportSummary;
  filters: {
    userId: string;
    role: "buyer" | "seller" | "both";
    status?: string;
    startDate?: string;
    endDate?: string;
  };
}

interface OrdersReportPageProps {
  user: {
    id: string;
  };
}

export default function OrdersReportPage({ user }: OrdersReportPageProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [filters, setFilters] = useState({
    userId: user.id,
    role: "both",
    status: "all",
    startDate: "",
    endDate: "",
  });

  const validateDates = useCallback(() => {
    if (
      filters.startDate &&
      filters.endDate &&
      new Date(filters.startDate) > new Date(filters.endDate)
    ) {
      toast.error("Start date cannot be after end date");
      return false;
    }
    return true;
  }, [filters.startDate, filters.endDate]);

  const fetchReport = useCallback(async () => {
    if (!user.id) {
      toast.error("User authentication required");
      return;
    }
    if (!validateDates()) {
      return;
    }

    setLoading(true);
    try {
      const filterParams: ReportFilters = {
        userId: user.id,
        role: filters.role as "buyer" | "seller" | "both",
        status: filters.status === "all" ? "all" : undefined,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const { data, error } = await getOrdersReport(filterParams);

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setReportData(data);
        toast.success("Report generated successfully");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate report"
      );
    } finally {
      setLoading(false);
    }
  }, [filters, user.id, validateDates]);

  const downloadPDF = useCallback(async () => {
    if (!user.id) {
      toast.error("User authentication required");
      return;
    }
    if (!validateDates()) {
      return;
    }

    setDownloadingPDF(true);
    try {
      const filterParams: ReportFilters = {
        userId: user.id,
        role: filters.role as "buyer" | "seller" | "both",
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      const { data: blob, error } = await downloadOrdersReportPDF(filterParams);

      if (error) {
        throw new Error(error);
      }

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-report-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("PDF downloaded successfully");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to download PDF"
      );
    } finally {
      setDownloadingPDF(false);
    }
  }, [filters, user.id, validateDates]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      WAITING_FOR_PAYMENT: "bg-yellow-100 text-yellow-800",
      PENDING: "bg-blue-100 text-blue-800",
      IN_PROGRESS: "bg-orange-100 text-orange-800",
      DELIVERED: "bg-green-100 text-green-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders Report</h1>
          <p className="text-gray-600">
            Generate and view detailed reports of your orders
          </p>
        </div>
        <Button
          onClick={downloadPDF}
          variant="outline"
          disabled={!reportData || downloadingPDF || loading}
          aria-label="Download report as PDF"
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadingPDF ? "Downloading..." : "Download PDF"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select
              value={filters.role}
              onValueChange={(value: "buyer" | "seller" | "both") =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger aria-label="Select role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Both (Buyer & Seller)</SelectItem>
                <SelectItem value="buyer">As Buyer</SelectItem>
                <SelectItem value="seller">As Seller</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger aria-label="Select status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="WAITING_FOR_PAYMENT">
                  Waiting for Payment
                </SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Start date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              aria-label="Start date"
            />

            <Input
              type="date"
              placeholder="End date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              aria-label="End date"
            />

            <Button
              onClick={fetchReport}
              disabled={loading || !user.id}
              aria-label="Generate report"
            >
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">
                    {reportData.summary.totalOrders}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    ${reportData.summary.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold">
                    ${reportData.summary.averageOrderValue.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">
                    {reportData.summary.completedOrders}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Breakdown */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reportData.summary.statusBreakdown).map(
                ([status, count]) => (
                  <Badge key={status} className={getStatusColor(status)}>
                    {status.replace("_", " ")}: {count}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      {reportData && reportData.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Order Details ({reportData.orders.length} orders)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Order ID</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Gig</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Buyer</th>
                    <th className="text-left p-2">Seller</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-sm">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="p-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-2">{order.gig?.title || "N/A"}</td>
                      <td className="p-2 font-semibold">
                        ${order.package?.price?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-2">{order.buyer.username}</td>
                      <td className="p-2">{order.seller.username}</td>
                      <td className="p-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {reportData && reportData.orders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              No orders found matching the selected criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {!reportData && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              Apply filters and generate a report to view order details.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
