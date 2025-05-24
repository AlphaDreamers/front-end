export const mockSellerData = {
  earnings: {
    totalEarnings: 45.7823,
    pendingPayouts: 3.2145,
    activeGigs: 8,
  },
  performance: {
    views: {
      total: 1245,
      change: 12,
    },
    orders: {
      total: 37,
      change: 8,
    },
    rating: {
      average: 4.8,
      total: 28,
    },
    conversionRate: 3.2,
  },
  gigs: [
    {
      id: "gig-1",
      title: "I will develop a secure smart contract for your blockchain project",
      image: "/placeholder.svg?height=100&width=100",
      price: 2.5,
      status: "active",
      orders: 12,
      views: 345,
      createdAt: "2023-08-15T10:30:00Z",
      category: "Blockchain & Crypto",
    },
    {
      id: "gig-2",
      title: "I will create a stunning NFT collection for your project",
      image: "/placeholder.svg?height=100&width=100",
      price: 1.8,
      status: "active",
      orders: 8,
      views: 210,
      createdAt: "2023-09-05T09:15:00Z",
      category: "Design",
    },
    {
      id: "gig-3",
      title: "I will write engaging crypto content for your blog or website",
      image: "/placeholder.svg?height=100&width=100",
      price: 0.6,
      status: "active",
      orders: 15,
      views: 420,
      createdAt: "2023-07-20T14:00:00Z",
      category: "Writing & Translation",
    },
    {
      id: "gig-4",
      title: "I will develop a full-stack DApp on Ethereum or Solana",
      image: "/placeholder.svg?height=100&width=100",
      price: 3.0,
      status: "paused",
      orders: 2,
      views: 150,
      createdAt: "2023-06-10T11:45:00Z",
      category: "Blockchain & Crypto",
    },
    {
      id: "gig-5",
      title: "I will create a marketing strategy for your crypto project",
      image: "/placeholder.svg?height=100&width=100",
      price: 1.4,
      status: "draft",
      orders: 0,
      views: 0,
      createdAt: "2023-10-01T15:20:00Z",
      category: "Marketing",
    },
  ],
  pendingOrders: [
    {
      id: "order-1",
      title: "Smart Contract Development for DeFi Project",
      buyer: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      price: 2.5,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      isUrgent: false,
    },
    {
      id: "order-2",
      title: "NFT Collection Design - 10 Unique Pieces",
      buyer: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      price: 1.8,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      isUrgent: true,
    },
    {
      id: "order-3",
      title: "Crypto Blog Content - 5 Articles",
      buyer: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      price: 0.6,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      isUrgent: false,
    },
  ],
}
