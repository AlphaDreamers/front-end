"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { jsPDF } from "jspdf";
const prisma = new PrismaClient();

export interface ReportFilters {
  userId: string;
  role: "buyer" | "seller" | "both";
  status?: "all";
  startDate?: string;
  endDate?: string;
}

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
  filters: ReportFilters;
}

export async function getOrdersReport(filters: ReportFilters): Promise<{
  data?: ReportData;
  error?: string;
}> {
  try {
    if (!filters.userId) {
      return { error: "User ID is required" };
    }
    if (!["buyer", "seller", "both"].includes(filters.role)) {
      return { error: "Invalid role" };
    }
    if (
      filters.status &&
      filters.status !== "all" &&
      ![
        "WAITING_FOR_PAYMENT",
        "PENDING",
        "IN_PROGRESS",
        "DELIVERED",
        "COMPLETED",
        "CANCELLED",
      ].includes(filters.status)
    ) {
      return { error: "Invalid status" };
    }
    if (filters.startDate && isNaN(Date.parse(filters.startDate))) {
      return { error: "Invalid start date" };
    }
    if (filters.endDate && isNaN(Date.parse(filters.endDate))) {
      return { error: "Invalid end date" };
    }
    if (
      filters.startDate &&
      filters.endDate &&
      new Date(filters.startDate) > new Date(filters.endDate)
    ) {
      return { error: "Start date cannot be after end date" };
    }

    const where: Prisma.OrderWhereInput = {};
    if (filters.role === "buyer") {
      where.buyerId = filters.userId;
    } else if (filters.role === "seller") {
      where.sellerId = filters.userId;
    } else {
      where.OR = [{ buyerId: filters.userId }, { sellerId: filters.userId }];
    }

    if (filters.status && filters.status !== "all") {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
        seller: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
        gig: { select: { id: true, title: true } },
        package: { select: { title: true, price: true } },
        transaction: { select: { txId: true, amount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const summary: ReportSummary = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.package?.price || 0),
        0
      ),
      statusBreakdown: orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      averageOrderValue:
        orders.length > 0
          ? orders.reduce(
              (sum, order) => sum + (order.package?.price || 0),
              0
            ) / orders.length
          : 0,
      completedOrders: orders.filter((o) => o.status === "COMPLETED").length,
      pendingOrders: orders.filter((o) => o.status !== "COMPLETED").length,
    };

    return {
      data: {
        orders: orders.map((order) => ({
          ...order,
          createdAt: order.createdAt.toISOString(),
          deadline: order.deadline.toISOString(),
          gig: order.gig || undefined,
          transaction: order.transaction || undefined,
        })),
        summary,
        filters,
      },
    };
  } catch (error) {
    console.error("Error in getOrdersReport:", error);
    return {
      error:
        error instanceof Prisma.PrismaClientKnownRequestError
          ? "Database error occurred"
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred",
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function downloadOrdersReportPDF(filters: ReportFilters): Promise<{
  data?: Blob;
  error?: string;
}> {
  try {
    if (!filters.userId) {
      return { error: "User ID is required" };
    }
    if (!["buyer", "seller", "both"].includes(filters.role)) {
      return { error: "Invalid role" };
    }
    if (
      filters.status &&
      filters.status !== "all" &&
      ![
        "WAITING_FOR_PAYMENT",
        "PENDING",
        "IN_PROGRESS",
        "DELIVERED",
        "COMPLETED",
        "CANCELLED",
      ].includes(filters.status)
    ) {
      return { error: "Invalid status" };
    }
    if (filters.startDate && isNaN(Date.parse(filters.startDate))) {
      return { error: "Invalid start date" };
    }
    if (filters.endDate && isNaN(Date.parse(filters.endDate))) {
      return { error: "Invalid end date" };
    }
    if (
      filters.startDate &&
      filters.endDate &&
      new Date(filters.startDate) > new Date(filters.endDate)
    ) {
      return { error: "Start date cannot be after end date" };
    }

    const where: Prisma.OrderWhereInput = {};
    if (filters.role === "buyer") {
      where.buyerId = filters.userId;
    } else if (filters.role === "seller") {
      where.sellerId = filters.userId;
    } else {
      where.OR = [{ buyerId: filters.userId }, { sellerId: filters.userId }];
    }

    if (filters.status && filters.status !== "all") {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: { select: { username: true } },
        seller: { select: { username: true } },
        gig: { select: { title: true } },
        package: { select: { price: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    doc.setFont("times", "normal");
    doc.setFontSize(20);
    doc.text("Orders Report", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, {
      align: "center",
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.package?.price || 0),
      0
    );
    doc.setFontSize(14);
    doc.text("Summary", 20, 50);
    doc.setFontSize(12);
    doc.text(`Total Orders: ${orders.length}`, 20, 60);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 20, 70);
    doc.text(
      `Average Order Value: $${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0.00"}`,
      20,
      80
    );

    doc.setFontSize(14);
    doc.text("Order Details", 20, 100);
    let y = 110;
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    doc.text("Order ID", 20, y);
    doc.text("Status", 50, y);
    doc.text("Gig", 80, y);
    doc.text("Amount", 110, y);
    doc.text("Buyer", 140, y);
    doc.text("Seller", 170, y);
    y += 8;
    doc.setFont("times", "normal");

    orders.forEach((order) => {
      doc.text(order.id.substring(0, 8), 20, y);
      doc.text(order.status.replace("_", " "), 50, y);
      doc.text(order.gig?.title || "N/A", 80, y);
      doc.text(`$${order.package?.price?.toFixed(2) || "0.00"}`, 110, y);
      doc.text(order.buyer.username, 140, y);
      doc.text(order.seller.username, 170, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    const buffer = Buffer.from(doc.output("arraybuffer"));
    return { data: new Blob([buffer], { type: "application/pdf" }) };
  } catch (error) {
    console.error("Error in downloadOrdersReportPDF:", error);
    return {
      error:
        error instanceof Prisma.PrismaClientKnownRequestError
          ? "Database error occurred"
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred",
    };
  } finally {
    await prisma.$disconnect();
  }
}
