"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, CreditCard, RefreshCw, Search, ExternalLink } from "lucide-react"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    date: new Date(2023, 11, 15),
    type: "deposit",
    amount: 2.5,
    status: "completed",
    address: "sol7x8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9",
  },
  {
    id: "tx2",
    date: new Date(2023, 11, 10),
    type: "withdrawal",
    amount: -1.2,
    status: "completed",
    address: "sol1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3",
  },
  {
    id: "tx3",
    date: new Date(2023, 11, 5),
    type: "payment",
    amount: -0.75,
    status: "completed",
    address: "sol2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4",
  },
  {
    id: "tx4",
    date: new Date(2023, 10, 28),
    type: "refund",
    amount: 0.5,
    status: "completed",
    address: "sol3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5",
  },
  {
    id: "tx5",
    date: new Date(2023, 10, 20),
    type: "fee",
    amount: -0.001,
    status: "completed",
    address: "System",
  },
  {
    id: "tx6",
    date: new Date(),
    type: "withdrawal",
    amount: -0.5,
    status: "pending",
    address: "sol4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6",
  },
  {
    id: "tx7",
    date: new Date(2023, 10, 15),
    type: "payment",
    amount: -1.8,
    status: "failed",
    address: "sol5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7",
  },
]

export default function TransactionsTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter transactions based on search and filters
  const filteredTransactions = mockTransactions.filter((tx) => {
    // Search filter
    const matchesSearch =
      tx.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    const matchesType = typeFilter === "all" || tx.type === typeFilter

    // Status filter
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Function to get icon based on transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case "refund":
        return <RefreshCw className="h-4 w-4 text-yellow-500" />
      case "fee":
        return <CreditCard className="h-4 w-4 text-gray-500" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  // Function to format address for display
  const formatAddress = (address: string) => {
    if (address === "System") return "System"
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View and search your transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address or transaction ID"
                className="pl-8 bg-background border-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="group hover:bg-muted/50">
                      <TableCell className="font-medium">{tx.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(tx.type)}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className={tx.amount >= 0 ? "text-green-500" : "text-red-500"}>
                        {tx.amount >= 0 ? "+" : ""}
                        {tx.amount.toFixed(3)} SOL
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${tx.status === "completed" ? "border-green-500 text-green-500" : ""}
                            ${tx.status === "pending" ? "border-yellow-500 text-yellow-500" : ""}
                            ${tx.status === "failed" ? "border-red-500 text-red-500" : ""}
                          `}
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{formatAddress(tx.address)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(`https://explorer.solana.com/tx/${tx.id}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't made any transactions yet"}
              </p>
              {(searchQuery || typeFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setTypeFilter("all")
                    setStatusFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
