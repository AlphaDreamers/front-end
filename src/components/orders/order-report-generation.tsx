"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadOrdersReportPDF, ReportFilters } from "@/lib/actions/report";
import PageTemplate from "../templates/page-template";

interface OrdersReportPageProps {
  user: {
    id: string;
  };
}

export default function OrdersReportPage({ user }: OrdersReportPageProps) {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [filters, setFilters] = useState({
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
        role: "both",
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

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

  return (
    <PageTemplate
      title="Orders Report"
      description="Generate and download a report of your orders within a specified date range."
      centered
    >
      <Card className="my-14 mx-auto h-full w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Generate Orders Report
          </CardTitle>
          <p className="text-muted-foreground">
            Select date range to generate your orders report
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">From Date</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
                aria-label="Start date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">To Date</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
                aria-label="End date"
              />
            </div>
          </div>

          <Button
            onClick={downloadPDF}
            disabled={downloadingPDF}
            className="w-full"
            size="lg"
          >
            <Download className="mr-2 h-4 w-4" />
            {downloadingPDF
              ? "Generating Report..."
              : "Generate & Download Report"}
          </Button>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}
