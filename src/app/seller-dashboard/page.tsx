"use client";

import { useState } from "react";
import { EarningsSummary } from "@/components/seller/earnings-summary";
import { PerformanceStats } from "@/components/seller/performance-stats";
import { GigList } from "@/components/seller/gig-list";
import { PendingOrders } from "@/components/seller/pending-orders";
import { mockSellerData } from "@/lib/seller-mock-data";
import { toast } from "sonner";

export default function SellerDashboardPage() {
  const [gigs, setGigs] = useState(mockSellerData.gigs);
  const [pendingOrders, setPendingOrders] = useState(
    mockSellerData.pendingOrders
  );

  const handleCreateGig = () => {
    // In a real app, this would navigate to a gig creation page
    toast.success("Create New Gig Navigating to gig creation page...");
  };

  const handleEditGig = (gig: any) => {
    toast.success(`Editing Gig... Editing gig: ${gig.title}`);
  };

  const handleDeleteGig = (gig: any) => {
    setGigs(gigs.filter((g) => g.id !== gig.id));
    toast.success(`Gig Deleted "${gig.title}" has been deleted.`);
  };

  const handleToggleStatus = (gig: any) => {
    const newStatus = gig.status === "active" ? "paused" : "active";
    setGigs(
      gigs.map((g) =>
        g.id === gig.id
          ? {
              ...g,
              status: newStatus,
            }
          : g
      )
    );
    toast.success(
      `Gig ${newStatus === "active" ? "Activated" : "Paused"} "${gig.title}" is now ${newStatus}.`
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

      <EarningsSummary
        totalEarnings={mockSellerData.earnings.totalEarnings}
        pendingPayouts={mockSellerData.earnings.pendingPayouts}
        activeGigs={mockSellerData.earnings.activeGigs}
        onCreateGig={handleCreateGig}
      />

      <PerformanceStats stats={mockSellerData.performance} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GigList
            gigs={gigs}
            onEdit={handleEditGig}
            onDelete={handleDeleteGig}
            onToggleStatus={handleToggleStatus}
          />
        </div>
        <div>
          <PendingOrders orders={pendingOrders} />
        </div>
      </div>
    </div>
  );
}
