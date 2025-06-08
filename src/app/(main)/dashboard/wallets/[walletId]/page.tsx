"use client";

import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Search,
  Wallet,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast as t } from "sonner";

// Mock transaction data
const mockTransactions = [
  {
    id: "5J7K...9M2N",
    date: "2024-01-15T10:30:00Z",
    type: "Payment",
    amount: -0.5,
    status: "Confirmed",
    txId: "3Nc4...7Kp9",
  },
  {
    id: "8P1Q...4R5S",
    date: "2024-01-14T15:45:00Z",
    type: "Refund",
    amount: 0.25,
    status: "Confirmed",
    txId: "6Vx2...1Zy8",
  },
  {
    id: "2T6U...9W0X",
    date: "2024-01-13T09:15:00Z",
    type: "Payment",
    amount: -1.2,
    status: "Pending",
    txId: "9Qw3...5Er7",
  },
  {
    id: "7Y8Z...3A4B",
    date: "2024-01-12T14:20:00Z",
    type: "Payment",
    amount: -0.8,
    status: "Failed",
    txId: "4Df6...2Gh9",
  },
  {
    id: "1C5D...8E9F",
    date: "2024-01-11T11:00:00Z",
    type: "Payment",
    amount: -2.1,
    status: "Confirmed",
    txId: "7Hj1...0Kl3",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toast = (args: any) => t.info(JSON.stringify(args));

export default function WalletPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock wallet data
  const walletAddress =
    "9F7A8B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0EA";
  const abbreviatedAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-2)}`;
  const balance = 12.45; // SOL

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const openInExplorer = (txId: string) => {
    window.open(`https://explorer.solana.com/tx/${txId}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Confirmed: "default",
      Pending: "secondary",
      Failed: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}${amount.toFixed(3)} SOL`;
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType =
      filterType === "all" ||
      tx.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus =
      filterStatus === "all" ||
      tx.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      tx.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <h1 className="text-3xl font-bold">My Wallet</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your Solana wallet and view transaction history.
        </p>
      </div>

      {/* Wallet Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wallet Address</CardTitle>
            <CardDescription>Your connected Solana wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {abbreviatedAddress}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(walletAddress, "Wallet address")}
                aria-label="Copy wallet address"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Balance</CardTitle>
            <CardDescription>Current SOL balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.toFixed(3)} SOL</div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View all your Solana transactions and their current status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by transaction ID or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="type-filter" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell
                      className={
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {transaction.txId}
                      </code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(transaction.txId, "Transaction ID")
                          }
                          aria-label={`Copy transaction ID ${transaction.txId}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInExplorer(transaction.txId)}
                          aria-label={`View transaction ${transaction.txId} on Solana Explorer`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{transaction.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatAmount(transaction.amount)}
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Transaction ID:
                        </span>
                        <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                          {transaction.txId}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(transaction.txId, "Transaction ID")
                          }
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInExplorer(transaction.txId)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Explorer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredTransactions.length
                )}{" "}
                of {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No transactions found</div>
              <div className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or search terms
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optional Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Actions</CardTitle>
          <CardDescription>
            Additional wallet management options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" disabled>
              <Wallet className="h-4 w-4 mr-2" />
              Withdraw Funds
              <span className="ml-2 text-xs text-muted-foreground">
                (Coming Soon)
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `https://explorer.solana.com/address/${walletAddress}`,
                  "_blank"
                )
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Wallet on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
