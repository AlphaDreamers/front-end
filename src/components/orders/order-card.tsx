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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import SolanaBuyButton from "@/components/solana-pay-button";
import {
  acceptOrder,
  deliverWork,
  acceptDelivery,
  requestRevision,
} from "@/lib/actions/order";
import UserDetails from "../user-details";

interface OrderCardProps {
  order: Order;
  currentUserId: string;
  isVerifiedSeller?: boolean;
  onUpdate?: () => void;
}

// Status badge configuration
const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    WAITING_FOR_PAYMENT: {
      label: "Waiting for Payment",
      className: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    PENDING: {
      label: "Pending",
      className: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    IN_PROGRESS: {
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

  const isBuyer = currentUserId === order.buyer.id;
  const isSeller = currentUserId === order.seller.id;
  const contact = isBuyer ? order.seller : order.buyer;

  // Handle order actions
  const handleAcceptOrder = async () => {
    setIsProcessing(true);
    try {
      await acceptOrder(order.id);
      toast.success("Order accepted successfully");
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept order"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeliverWork = async () => {
    setIsProcessing(true);
    try {
      // In a real app, you'd upload files to Cloudinary first
      const fileUrls: string[] = []; // Placeholder for uploaded file URLs

      await deliverWork(order.id, deliveryMessage, fileUrls);
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

  const handleAcceptDelivery = async () => {
    setIsProcessing(true);
    try {
      await acceptDelivery(order.id);
      toast.success("Delivery accepted. Don't forget to leave a review!");
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept delivery"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionDetails.trim()) {
      toast.error("Please provide revision details");
      return;
    }

    setIsProcessing(true);
    try {
      await requestRevision(order.id, revisionDetails);
      toast.success("Revision request sent. Deadline extended by 48 hours.");
      setRevisionDetails("");
      onUpdate?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to request revision"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDeliveryFiles(Array.from(e.target.files));
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

        <CardDescription>
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
            {order.status === "WAITING_FOR_PAYMENT" && (
              <SolanaBuyButton orderId={order.id} />
            )}

            {order.status === "DELIVERED" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Delivery
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Accept Delivery</DialogTitle>
                    <DialogDescription>
                      By accepting this delivery, you confirm that the work
                      meets your requirements. You'll be able to leave a review
                      after accepting.
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
            )}

            {order.status === "COMPLETED" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Request Revision
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Revision</DialogTitle>
                    <DialogDescription>
                      Describe what needs to be revised. The deadline will be
                      extended by 48 hours.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Please describe the revisions needed..."
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
                      onClick={handleRequestRevision}
                      disabled={isProcessing || !revisionDetails.trim()}
                    >
                      {isProcessing ? "Sending..." : "Request Revision"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {order.status === "COMPLETED" && !order.reviewId && (
              <Link
                href={`/dashboard/orders/${order.id}/review`}
                className={cn(buttonVariants({}), "w-full justify-start")}
              >
                <CheckCircle />
                Leave Review
              </Link>
            )}
          </>
        )}

        {isSeller && (
          <>
            {order.status === "PENDING" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Accept Order</DialogTitle>
                    <DialogDescription>
                      By accepting this order, you commit to delivering the work
                      by the deadline.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button onClick={handleAcceptOrder} disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Accept Order"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {order.status === "IN_PROGRESS" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start">
                    <Upload />
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
                      <Label htmlFor="delivery-message">Delivery Message</Label>
                      <Textarea
                        id="delivery-message"
                        placeholder="Describe what you're delivering..."
                        value={deliveryMessage}
                        onChange={(e) => setDeliveryMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
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
                        Max 1GB per file. Supported: ZIP, PDF, images, documents
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
            )}
          </>
        )}

        {order.status !== "COMPLETED" && (
          <div className="flex gap-2 w-full">
            <Link
              href={`/dashboard/orders/${order.id}/chat`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 justify-start"
              )}
            >
              <MessageSquare />
              Message
            </Link>

            <Link
              href={"/contact/support"}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "flex-1 justify-start",
                })
              )}
            >
              <HelpCircle />
              Get Support
            </Link>
          </div>
        )}

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
            <ExternalLink />
            View Transaction
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
