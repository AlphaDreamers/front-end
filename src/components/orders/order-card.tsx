"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  CheckCircle,
  Upload,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Order } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  deliverWork,
  acceptDelivery,
  rejectDelivery,
  cancelOrder,
} from "@/lib/actions/orders";
import UserDetails from "../user-details";
import { OrderStatus } from "@prisma/client";
import PayButton from "@/components/pay-button";

interface OrderCardProps {
  order: Order;
  currentUserId: string;
  isVerifiedSeller?: boolean;
  onUpdate?: () => void;
}

// Status badge configuration
const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING_PAYMENT: {
      label: "Waiting for Payment",
      className: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    PAID: {
      label: "In Progress",
      className: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    DELIVERED: {
      label: "Delivered",
      className: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    COMPLETED: {
      label: "Completed",
      className: "bg-green-600 hover:bg-green-700 text-white",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-600 hover:bg-red-700 text-white",
    },
    DISPUTE: {
      label: "In Dispute",
      className: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    REFUNDED: {
      label: "Refunded",
      className: "bg-gray-600 hover:bg-gray-700 text-white",
    },
    EXPIRED: {
      label: "Expired",
      className: "bg-gray-500 hover:bg-gray-600 text-white",
    },
    LATE: {
      label: "Late",
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
  };

export default function OrderCard({
  order,
  currentUserId,
  onUpdate,
}: OrderCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [revisionDetails, setRevisionDetails] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const [deliveryLinks, setDeliveryLinks] = useState<string[]>([]);

  const isBuyer = currentUserId === order.buyer.id;
  const isSeller = currentUserId === order.seller.id;
  const contact = isBuyer ? order.seller : order.buyer;

  // Handler for accepting delivery (buyer action)
  const handleAcceptDelivery = async () => {
    setIsProcessing(true);
    try {
      await acceptDelivery(order.id);
      toast.success("Delivery accepted! You can now leave a review.");
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept delivery"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for delivering work (seller action)
  const handleDeliverWork = async () => {
    if (!deliveryMessage.trim()) {
      toast.error("Please provide a delivery message");
      return;
    }
    const totalSize = deliveryFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 1024 * 1024 * 1024) {
      toast.error("Files must be under 1GB");
      return;
    }
    if (
      deliveryFiles.some(
        (file) =>
          !["zip", "pdf", "jpg", "jpeg", "png"].includes(
            file.name.split(".").pop()?.toLowerCase() || ""
          )
      )
    ) {
      toast.error(
        "Files must be in a supported format: .zip, .pdf, .jpg, .jpeg, .png"
      );
      return;
    }

    setIsProcessing(true);
    try {
      await deliverWork({
        orderId: order.id,
        files: deliveryFiles,
        links: deliveryLinks,
        explanation: deliveryMessage,
      });
      toast.success("Work delivered successfully");
      setDeliveryMessage("");
      setDeliveryFiles([]);
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to deliver work"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for canceling order (buyer: before payment, seller: after payment)
  const handleCancelOrder = async () => {
    setIsProcessing(true);
    try {
      await cancelOrder(order.id);
      const message =
        order.status === "PENDING_PAYMENT"
          ? "Order cancelled"
          : "Order cancelled. Refund will be processed.";
      toast.success(message);
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel order"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for rejecting delivery (buyer action)
  const handleRejectDelivery = async (reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      await rejectDelivery(order.id);
      toast.success("Delivery rejected. Dispute opened.");
      setRevisionDetails("");
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject delivery"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Optional: Add file size validation
      const maxSize = 1024 * 1024 * 1024; // 1GB
      const oversizedFiles = files.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        toast.error(
          `Some files exceed 1GB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`
        );
        return;
      }

      setDeliveryFiles(files);
    }
  };

  return (
    <Card className="relative">
      <Badge
        className={cn(
          "absolute top-6 right-6",
          statusConfig[order.status].className
        )}
      >
        {statusConfig[order.status].label}
      </Badge>

      <CardHeader>
        <CardTitle>{order.package.gig.title}</CardTitle>

        <CardDescription className="flex items-center justify-between mt-1">
          <span>#{order.id}</span>
          {formatDistanceToNow(order.createdAt, { addSuffix: true })}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UserDetails user={contact} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock
              className={cn(
                "h-4 w-4",
                order.isOverdue ? "text-red-500" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-sm",
                order.isOverdue
                  ? "text-red-500 font-medium"
                  : "text-muted-foreground"
              )}
            >
              {order.formattedDeadline}
            </span>
          </div>

          <span className="text-xl font-semibold text-primary mt-2">
            {order.package.price} SOL
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 w-full">
        {/* Buyer Actions */}
        {isBuyer && (
          <>
            {(order.status === "PENDING_PAYMENT" ||
              order.status === "LATE") && (
              <>
                <PayButton
                  order={{
                    id: order.id,
                    package: {
                      price: order.package.price,
                      title: order.package.title,
                      gig: {
                        title: order.package.gig.title,
                      },
                    },
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </Button>
              </>
            )}

            {order.status === "DELIVERED" && (
              <div className="flex items-center gap-2 w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 justify-start">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accept Delivery
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Accept Delivery</DialogTitle>
                      <DialogDescription>
                        By accepting this delivery, you confirm that the work
                        meets your requirements. You&apos;ll be able to leave a
                        review after accepting.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button
                        onClick={handleAcceptDelivery}
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Accept Delivery"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1 justify-start"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Reject Delivery
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Revision</DialogTitle>
                      <DialogDescription>
                        Describe why you&apos;re rejecting this delivery. This
                        will open a dispute and notify the seller.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Please describe why you're rejecting this delivery..."
                        value={revisionDetails}
                        onChange={(e) => setRevisionDetails(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setRevisionDetails("")}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleRejectDelivery(revisionDetails)}
                        disabled={isProcessing || !revisionDetails.trim()}
                      >
                        {isProcessing ? "Processing..." : "Request Revision"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {order.status === "COMPLETED" &&
              !order.reviewId &&
              order.completedAt &&
              order.completedAt >
                new Date(Date.now() - 72 * 60 * 60 * 1000) && (
                <Link
                  href={`/dashboard/orders/${order.id}/review`}
                  className={cn(buttonVariants({}), "w-full justify-start")}
                >
                  <CheckCircle />
                  Leave Review (
                  {Math.max(
                    0,
                    Math.ceil(
                      (3 * 24 * 60 * 60 * 1000 -
                        (Date.now() - new Date(order.completedAt).getTime())) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}{" "}
                  days left )
                </Link>
              )}

            {order.status === "EXPIRED" && (
              <Link
                href={`/gig/${order.package.gig.id}`}
                className={cn(buttonVariants({}), "w-full justify-start")}
              >
                Create New Order
              </Link>
            )}
          </>
        )}

        {/* Seller Actions */}
        {isSeller && (
          <>
            {(order.status === "PAID" ||
              order.status === "DISPUTE" ||
              order.status === "LATE") && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Deliver Work
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deliver Your Work</DialogTitle>
                      <DialogDescription>
                        Upload your files and add a message for the buyer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="delivery-message">
                          Delivery Message
                        </Label>
                        <Textarea
                          id="delivery-message"
                          placeholder="Describe what you're delivering..."
                          value={deliveryMessage}
                          onChange={(e) => setDeliveryMessage(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="delivery-links">Links (Optional)</Label>
                        <div className="space-y-2 mt-2">
                          {deliveryLinks.map((link, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Input
                                type="text"
                                placeholder="https://your-link.com"
                                value={link}
                                onChange={(e) =>
                                  setDeliveryLinks((prev) =>
                                    prev.map((l, i) =>
                                      i === index ? e.target.value : l
                                    )
                                  )
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDeliveryLinks((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-3"
                          onClick={() =>
                            setDeliveryLinks((prev) => [...prev, ""])
                          }
                        >
                          + Add Link
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          You can also provide links to your work here.
                        </p>
                        {deliveryLinks.filter((link) => link.trim() !== "")
                          .length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {
                              deliveryLinks.filter((link) => link.trim() !== "")
                                .length
                            }{" "}
                            link(s) provided
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="delivery-files">Files (Optional)</Label>
                        <Input
                          id="delivery-files"
                          type="file"
                          multiple
                          accept=".zip,.pdf,.png,.jpg,.jpeg,.doc,.docx"
                          onChange={handleFileChange}
                        />
                        <p className="text-xs text-muted-foreground">
                          Max 1GB per file. Supported: ZIP, PDF, images,
                          documents
                        </p>
                        {deliveryFiles.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {deliveryFiles.length} file(s) selected
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDeliveryMessage("");
                          setDeliveryFiles([]);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeliverWork}
                        disabled={isProcessing || !deliveryMessage.trim()}
                      >
                        {isProcessing ? "Uploading..." : "Deliver Work"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </>
        )}

        {/* Common Actions - Message and Support (not for completed orders) */}
        {order.status !== "COMPLETED" &&
          order.status !== "CANCELLED" &&
          order.status !== "EXPIRED" && (
            <div className="flex gap-2 w-full">
              <Link
                href={`/dashboard/orders/${order.id}/chat`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex-1 justify-start"
                )}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Link>

              <Link
                href={"/contact-us/support"}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex-1 justify-start"
                )}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Support
              </Link>
            </div>
          )}

        {/* Transaction Link for Completed Orders */}
        {order.status === "COMPLETED" && order.transaction && (
          <Link
            href={`https://explorer.solana.com/tx/${order.transaction.txId}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start"
            )}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Transaction
          </Link>
        )}

        {/* Transaction Link for Cancelled Orders (if payment was made) */}
        {order.status === "CANCELLED" && order.transaction && (
          <Link
            href={`https://explorer.solana.com/tx/${order.transaction.txId}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start"
            )}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Transaction
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
