import type { OrderStatus } from "./types"

export interface OrderData {
  id: string
  title: string
  price: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  dueDate: string
  userRole: "buyer" | "seller"
  buyer: {
    id: string
    name: string
    avatar: string
  }
  seller: {
    id: string
    name: string
    avatar: string
  }
  gig: {
    id: string
    title: string
  }
  requirements?: string
  deliveryMessage?: string
  revisions: number
  revisionsUsed: number
}

export const mockOrders: OrderData[] = [
  {
    id: "order-1234567890",
    title: "Professional Logo Design",
    price: 2.5,
    status: "in_progress",
    createdAt: "2023-11-01T10:30:00Z",
    updatedAt: "2023-11-01T10:30:00Z",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    userRole: "buyer",
    buyer: {
      id: "user-1",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    seller: {
      id: "user-2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    gig: {
      id: "gig-1",
      title: "I will design a professional logo for your brand",
    },
    requirements: "I need a minimalist logo for my tech startup. The brand colors are blue and purple.",
    revisions: 2,
    revisionsUsed: 0,
  },
  {
    id: "order-2345678901",
    title: "Smart Contract Development",
    price: 5.0,
    status: "delivered",
    createdAt: "2023-10-25T14:45:00Z",
    updatedAt: "2023-11-02T09:15:00Z",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    userRole: "buyer",
    buyer: {
      id: "user-1",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    seller: {
      id: "user-3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    gig: {
      id: "gig-2",
      title: "I will develop a secure smart contract for your blockchain project",
    },
    requirements: "I need a smart contract for an NFT marketplace with royalty features.",
    deliveryMessage:
      "I've completed the smart contract as requested. Please review the code and let me know if you need any adjustments.",
    revisions: 3,
    revisionsUsed: 0,
  },
  {
    id: "order-3456789012",
    title: "Website Content Writing",
    price: 1.2,
    status: "completed",
    createdAt: "2023-10-15T11:20:00Z",
    updatedAt: "2023-10-22T16:30:00Z",
    dueDate: "2023-10-20T23:59:59Z",
    userRole: "buyer",
    buyer: {
      id: "user-1",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    seller: {
      id: "user-4",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    gig: {
      id: "gig-3",
      title: "I will write engaging crypto content for your blog or website",
    },
    requirements: "I need 5 blog posts about DeFi trends, each around 1000 words.",
    deliveryMessage:
      "Here are the 5 blog posts as requested. I've focused on the latest DeFi trends and made sure they're SEO-optimized.",
    revisions: 2,
    revisionsUsed: 1,
  },
  {
    id: "order-4567890123",
    title: "NFT Collection Design",
    price: 3.0,
    status: "cancelled",
    createdAt: "2023-09-28T09:10:00Z",
    updatedAt: "2023-10-05T13:45:00Z",
    dueDate: "2023-10-15T23:59:59Z",
    userRole: "seller",
    buyer: {
      id: "user-5",
      name: "Jessica Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    seller: {
      id: "user-1",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    gig: {
      id: "gig-4",
      title: "I will create a stunning NFT collection for your project",
    },
    requirements: "I need a collection of 10 unique NFT designs with a space theme.",
    revisions: 3,
    revisionsUsed: 0,
  },
  {
    id: "order-5678901234",
    title: "DApp Development",
    price: 6.0,
    status: "in_progress",
    createdAt: "2023-11-03T08:30:00Z",
    updatedAt: "2023-11-03T08:30:00Z",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    userRole: "seller",
    buyer: {
      id: "user-6",
      name: "David Thompson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    seller: {
      id: "user-1",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    gig: {
      id: "gig-5",
      title: "I will develop a full-stack DApp on Ethereum or Solana",
    },
    requirements: "I need a DApp for a decentralized voting system on Solana.",
    revisions: 2,
    revisionsUsed: 0,
  },
  {
    id: "order-6789012345",
    title: "Marketing Strategy",
    price: 2.8,
    status: "disputed",
    createdAt: "2023-10-10T15:20:00Z",
    updatedAt: "2023-10-25T11:40:00Z",
    dueDate: "2023-10-24T23:59:59Z",
    userRole: "buyer",
    buyer: {
      id: "user-1",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    seller: {
      id: "user-7",
      name: "Olivia Martinez",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    gig: {
      id: "gig-6",
      title: "I will create a marketing strategy for your crypto project",
    },
    requirements: "I need a comprehensive marketing strategy for my new token launch.",
    deliveryMessage:
      "Here's the marketing strategy as discussed. I've included a 3-month plan with specific actions for each phase.",
    revisions: 2,
    revisionsUsed: 2,
  },
]
