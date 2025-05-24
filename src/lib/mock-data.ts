export type TransactionType = "deposit" | "withdrawal" | "payment" | "refund" | "fee"

export type TransactionStatus = "completed" | "pending" | "failed"

export type Transaction = {
  id: string
  date: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  address: string
  description?: string
}

export type User = {
  id: string
  username: string
  displayName: string
  email: string
  avatar: string
  isVerified: boolean
  userType?: "seller" | "buyer" | "both"
}

export type GigStatus = "active" | "inactive" | "pending_review" | "rejected"

export type GigPackage = {
  id: string
  name: "basic" | "standard" | "premium"
  description: string
  deliveryTime: number
  revisions: number
  price: number
}

export type Gig = {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string
  tags: string[]
  status: GigStatus
  packages: GigPackage[]
  images: string[]
  orders: number
  rating?: number
  createdAt: string
  updatedAt: string
  featured: boolean
}

export type Order = {
  id: string
  title: string
  otherParty: {
    username: string
    avatar: string
  }
  price: number
  status: "in_progress" | "delivered" | "completed" | "cancelled" | "disputed"
  dueDate: string
}

export type ActivityItem = {
  id: string
  type: "new_order" | "completed_order" | "new_review" | "payment_received" | "message" | "system"
  title: string
  description: string
  date: string
  read: boolean
  actionable?: boolean
  actionText?: string
}

export type Skill = {
  id: string
  name: string
  level: number
}

export type Certificate = {
  id: string
  name: string
  issuer: string
  file: string
  status: "verified" | "pending" | "rejected"
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export type Review = {
  id: string
  orderId: string
  gigId: string
  gigTitle: string
  gigImage: string
  reviewerId: string
  reviewerName: string
  reviewerAvatar: string
  reviewerIsVerified: boolean
  sellerId: string
  sellerName: string
  sellerAvatar: string
  rating: number
  comment: string
  date: string
  signatureHash: string
  response?: {
    comment: string
    date: string
  }
}

export const mockReviews: Review[] = [
  {
    id: "review-1",
    orderId: "order-1",
    gigId: "gig-1",
    gigTitle: "I will design a stunning website for your business",
    gigImage: "/placeholder.svg?height=200&width=300",
    reviewerId: "user-2",
    reviewerName: "Sarah Johnson",
    reviewerAvatar: "/placeholder.svg?height=50&width=50",
    reviewerIsVerified: true,
    sellerId: "user-1",
    sellerName: "Alex Morgan",
    sellerAvatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    comment:
      "Alex delivered an exceptional website design that perfectly captured my brand's essence. The communication was smooth, and he was very responsive to my feedback. I'm extremely satisfied with the final result and would definitely work with him again!",
    date: "2023-10-15T14:30:00Z",
    signatureHash: "0x8a7b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f",
    response: {
      comment:
        "Thank you so much for your kind words, Sarah! It was a pleasure working with you, and I'm thrilled that you're happy with the website. Looking forward to collaborating with you again in the future!",
      date: "2023-10-16T09:45:00Z",
    },
  },
  {
    id: "review-2",
    orderId: "order-2",
    gigId: "gig-2",
    gigTitle: "I will create a professional logo for your brand",
    gigImage: "/placeholder.svg?height=200&width=300",
    reviewerId: "user-3",
    reviewerName: "Michael Brown",
    reviewerAvatar: "/placeholder.svg?height=50&width=50",
    reviewerIsVerified: true,
    sellerId: "user-1",
    sellerName: "Alex Morgan",
    sellerAvatar: "/placeholder.svg?height=50&width=50",
    rating: 4,
    comment:
      "Great work on the logo design! Alex was professional and delivered on time. The design is clean and modern, exactly what I was looking for. The only reason for 4 stars instead of 5 is that we needed a few more revisions than expected to get to the final version.",
    date: "2023-09-28T11:20:00Z",
    signatureHash: "0x7b6c5d4e3f2g1h0i9j8k7l6m5n4o3p2q1r0s9t8u7v6w5x4y3z2a1b0c9d8e7f6",
  },
  {
    id: "review-3",
    orderId: "order-3",
    gigId: "gig-3",
    gigTitle: "I will develop a smart contract for your DeFi project",
    gigImage: "/placeholder.svg?height=200&width=300",
    reviewerId: "user-4",
    reviewerName: "Emily Davis",
    reviewerAvatar: "/placeholder.svg?height=50&width=50",
    reviewerIsVerified: false,
    sellerId: "user-1",
    sellerName: "Alex Morgan",
    sellerAvatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    comment:
      "Alex is a blockchain wizard! The smart contract he developed for our DeFi project is secure, efficient, and exactly what we needed. He explained complex concepts clearly and made sure we understood how everything works. Highly recommended for any Web3 development needs!",
    date: "2023-11-05T16:45:00Z",
    signatureHash: "0x5a4b3c2d1e0f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z9a8b7c6d5e4f",
    response: {
      comment:
        "Thank you for the wonderful review, Emily! It was a fascinating project to work on, and I'm glad the smart contract meets your needs. Feel free to reach out if you need any clarification or have questions in the future.",
      date: "2023-11-06T10:15:00Z",
    },
  },
  {
    id: "review-4",
    orderId: "order-4",
    gigId: "gig-4",
    gigTitle: "I will create engaging content for your crypto blog",
    gigImage: "/placeholder.svg?height=200&width=300",
    reviewerId: "user-1",
    reviewerName: "Alex Morgan",
    reviewerAvatar: "/placeholder.svg?height=50&width=50",
    reviewerIsVerified: true,
    sellerId: "user-5",
    sellerName: "Jessica Wilson",
    sellerAvatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    comment:
      "Jessica delivered exceptional content for my crypto blog. Her knowledge of blockchain technology and ability to explain complex concepts in an accessible way is impressive. The articles were well-researched, engaging, and delivered ahead of schedule. Will definitely order again!",
    date: "2023-10-20T13:10:00Z",
    signatureHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h",
  },
  {
    id: "review-5",
    orderId: "order-5",
    gigId: "gig-5",
    gigTitle: "I will design a stunning NFT collection",
    gigImage: "/placeholder.svg?height=200&width=300",
    reviewerId: "user-1",
    reviewerName: "Alex Morgan",
    reviewerAvatar: "/placeholder.svg?height=50&width=50",
    reviewerIsVerified: true,
    sellerId: "user-6",
    sellerName: "David Thompson",
    sellerAvatar: "/placeholder.svg?height=50&width=50",
    rating: 3,
    comment:
      "The NFT designs were good, but there were some issues with the delivery timeline. David was responsive to messages but missed the initial deadline by several days. The final designs were decent, though not exactly what I had envisioned. Would consider working together again but with clearer expectations.",
    date: "2023-11-10T09:30:00Z",
    signatureHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g",
  },
  {
    id: "review-6",
    orderId: "order-6",
    gigId: "gig-6",
    gigTitle: "I will create a marketing strategy for your token launch",
    gigImage: "/placeholder.svg?height=200&width=300",
    reviewerId: "user-1",
    reviewerName: "Alex Morgan",
    reviewerAvatar: "/placeholder.svg?height=50&width=50",
    reviewerIsVerified: true,
    sellerId: "user-7",
    sellerName: "Olivia Martinez",
    sellerAvatar: "/placeholder.svg?height=50&width=50",
    rating: 4,
    comment:
      "Olivia developed a comprehensive marketing strategy for our token launch. The plan was well-structured and included detailed steps for social media, community building, and PR. She has good knowledge of the crypto space and provided valuable insights. The only improvement could be more specific KPIs for measuring success.",
    date: "2023-09-15T15:20:00Z",
    signatureHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f",
  },
]

export const mockDashboardData = {
  user: {
    id: "user-1",
    username: "johndoe",
    displayName: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    isVerified: true,
  },
  stats: {
    gigs: {
      active: 4,
      total: 12,
    },
    orders: {
      active: 3,
      completed: 27,
    },
    reviews: {
      averageRating: 4.8,
      total: 85,
    },
    wallet: {
      balance: 7.5,
      currency: "SOL",
      pendingPayments: 1.25,
    },
  },
  gigs: [
    {
      id: "gig-1",
      title: "I will design a stunning website for your business",
      category: "Web Design",
      status: "active",
      price: 50,
      currency: "SOL",
      orders: 15,
    },
    {
      id: "gig-2",
      title: "I will write engaging content for your blog",
      category: "Writing",
      status: "inactive",
      price: 30,
      currency: "SOL",
      orders: 8,
    },
    {
      id: "gig-3",
      title: "I will create a professional logo for your brand",
      category: "Graphic Design",
      status: "active",
      price: 75,
      currency: "SOL",
      orders: 22,
    },
  ],
  activeOrders: [
    {
      id: "order-1",
      title: "Website Design",
      buyer: {
        username: "sarah_jones",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      price: 50,
      currency: "SOL",
      status: "in_progress",
      dueDate: "2023-11-15",
    },
    {
      id: "order-2",
      title: "Blog Content",
      buyer: {
        username: "mike_smith",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      price: 30,
      currency: "SOL",
      status: "delivered",
      dueDate: "2023-11-10",
    },
  ],
  recentActivity: [
    {
      id: "activity-1",
      type: "new_order",
      title: "New order received",
      description: "Sarah Jones has placed an order for your Website Design gig.",
      date: "2023-11-08T10:30:00Z",
      read: false,
    },
    {
      id: "activity-2",
      type: "payment_received",
      title: "Payment received",
      description: "You have received a payment of 50 SOL for the Website Design order.",
      date: "2023-11-08T09:45:00Z",
      read: true,
    },
    {
      id: "activity-3",
      type: "new_review",
      title: "New review received",
      description: "Mike Smith has left a 5-star review for your Blog Content gig.",
      date: "2023-11-07T16:20:00Z",
      read: true,
    },
  ],
}

export const mockWalletData = {
  balance: 12.3456,
  address: "GD2J6Y7534YG7623G6723GF2376GF2376",
  transactions: [
    {
      id: "tx-1",
      date: "2023-11-05T14:30:00Z",
      type: "deposit",
      amount: 5.0,
      status: "completed",
      address: "GE4T78H234JH7823H47823J4H823J4H8",
      description: "Deposit from external wallet",
    },
    {
      id: "tx-2",
      date: "2023-11-04T09:15:00Z",
      type: "withdrawal",
      amount: -2.5,
      status: "completed",
      address: "GA9K23L567KL2356KL7235KL7235KL7",
      description: "Withdrawal to external wallet",
    },
    {
      id: "tx-3",
      date: "2023-11-03T18:00:00Z",
      type: "payment",
      amount: -1.0,
      status: "completed",
      address: "GB1P54Q890PQ5489PQ1548PQ1548PQ1",
      description: "Payment for service",
    },
  ],
}

export const mockUserData = {
  username: "cryptodev",
  displayName: "Alex Morgan",
  avatar: "/placeholder.svg?height=200&width=200",
  bio: "Full-stack developer specializing in blockchain and Web3 technologies.",
  location: "San Francisco, CA",
  skills: [
    { id: "skill-1", name: "JavaScript", level: 5 },
    { id: "skill-2", name: "React", level: 4 },
    { id: "skill-3", name: "Solidity", level: 5 },
  ],
  certificates: [
    {
      id: "cert-1",
      name: "Certified Blockchain Developer",
      issuer: "Blockchain Council",
      file: "certificate1.pdf",
      status: "verified",
    },
    {
      id: "cert-2",
      name: "Advanced React & Redux",
      issuer: "Udemy",
      file: "certificate2.pdf",
      status: "pending",
    },
  ],
  badges: [
    {
      id: "top-rated",
      name: "Top Rated",
      description: "Consistently receives excellent reviews",
      icon: "award",
      rarity: "rare",
    },
    {
      id: "fast-delivery",
      name: "Speed Demon",
      description: "Completes projects ahead of schedule",
      icon: "zap",
      rarity: "uncommon",
    },
  ],
  selectedBadge: "top-rated",
}

export const skillOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "solidity", label: "Solidity" },
  { value: "typescript", label: "TypeScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "java", label: "Java" },
  { value: "c++", label: "C++" },
]

export const gigCategories = [
  {
    name: "Web Development",
    subcategories: ["Frontend", "Backend", "Full Stack", "WordPress", "E-commerce"],
  },
  {
    name: "Blockchain & Crypto",
    subcategories: ["Smart Contracts", "DApp Development", "NFT", "Token Development", "Web3 Integration"],
  },
  {
    name: "Design",
    subcategories: ["Logo Design", "UI/UX Design", "Graphic Design", "Illustration", "3D Modeling"],
  },
  {
    name: "Writing & Translation",
    subcategories: ["Content Writing", "Technical Writing", "Copywriting", "Translation", "Proofreading"],
  },
  {
    name: "Marketing",
    subcategories: ["Social Media", "SEO", "Content Marketing", "Email Marketing", "Influencer Marketing"],
  },
]

export const mockGigs: Gig[] = [
  {
    id: "gig-1",
    title: "I will develop a secure smart contract for your blockchain project",
    description:
      "I will create a secure, audited smart contract tailored to your specific needs. With over 5 years of experience in blockchain development, I ensure your contract is efficient, secure, and follows best practices.",
    category: "Blockchain & Crypto",
    subcategory: "Smart Contracts",
    tags: ["smart contract", "solidity", "ethereum", "blockchain", "web3"],
    status: "active",
    packages: [
      {
        id: "pkg-1-1",
        name: "basic",
        description:
          "Basic smart contract with standard functionality. Includes one revision and basic security features.",
        deliveryTime: 3,
        revisions: 1,
        price: 0.5,
      },
      {
        id: "pkg-1-2",
        name: "standard",
        description:
          "Advanced smart contract with custom functionality. Includes two revisions and comprehensive security features.",
        deliveryTime: 7,
        revisions: 2,
        price: 1.2,
      },
      {
        id: "pkg-1-3",
        name: "premium",
        description:
          "Enterprise-grade smart contract with complex functionality. Includes unlimited revisions, thorough security audit, and deployment assistance.",
        deliveryTime: 14,
        revisions: 5,
        price: 2.5,
      },
    ],
    images: ["/placeholder.svg?height=300&width=500"],
    orders: 27,
    rating: 4.9,
    createdAt: "2023-08-15T10:30:00Z",
    updatedAt: "2023-11-01T14:45:00Z",
    featured: true,
  },
  {
    id: "gig-2",
    title: "I will create a stunning NFT collection for your project",
    description:
      "I will design a unique and eye-catching NFT collection that stands out in the marketplace. Each piece will be carefully crafted with attention to detail and artistic excellence.",
    category: "Design",
    subcategory: "NFT",
    tags: ["nft", "digital art", "crypto art", "illustration", "collection"],
    status: "active",
    packages: [
      {
        id: "pkg-2-1",
        name: "basic",
        description: "5 unique NFT designs in a consistent style. Includes commercial rights and source files.",
        deliveryTime: 5,
        revisions: 2,
        price: 0.8,
      },
      {
        id: "pkg-2-2",
        name: "standard",
        description:
          "10 unique NFT designs with enhanced details and attributes. Includes commercial rights and source files.",
        deliveryTime: 10,
        revisions: 3,
        price: 1.5,
      },
      {
        id: "pkg-2-3",
        name: "premium",
        description:
          "20 unique NFT designs with premium quality, rarity traits, and metadata. Includes commercial rights, source files, and marketing materials.",
        deliveryTime: 21,
        revisions: 5,
        price: 3.0,
      },
    ],
    images: ["/placeholder.svg?height=300&width=500"],
    orders: 18,
    rating: 4.7,
    createdAt: "2023-09-05T09:15:00Z",
    updatedAt: "2023-10-20T11:30:00Z",
    featured: false,
  },
  {
    id: "gig-3",
    title: "I will write engaging crypto content for your blog or website",
    description:
      "I will create informative, engaging, and SEO-optimized content about cryptocurrency, blockchain, NFTs, and Web3 for your blog, website, or newsletter.",
    category: "Writing & Translation",
    subcategory: "Content Writing",
    tags: ["crypto content", "blockchain", "writing", "blog", "seo"],
    status: "active",
    packages: [
      {
        id: "pkg-3-1",
        name: "basic",
        description: "500-word article on a crypto topic of your choice. Includes basic research and one revision.",
        deliveryTime: 2,
        revisions: 1,
        price: 0.3,
      },
      {
        id: "pkg-3-2",
        name: "standard",
        description: "1000-word comprehensive article with in-depth research, SEO optimization, and two revisions.",
        deliveryTime: 4,
        revisions: 2,
        price: 0.6,
      },
      {
        id: "pkg-3-3",
        name: "premium",
        description:
          "2000-word expert article or whitepaper with extensive research, interviews, SEO optimization, and unlimited revisions.",
        deliveryTime: 7,
        revisions: 3,
        price: 1.2,
      },
    ],
    images: ["/placeholder.svg?height=300&width=500"],
    orders: 32,
    rating: 4.8,
    createdAt: "2023-07-20T14:00:00Z",
    updatedAt: "2023-11-05T16:20:00Z",
    featured: true,
  },
  {
    id: "gig-4",
    title: "I will develop a full-stack DApp on Ethereum or Solana",
    description:
      "I will create a complete decentralized application (DApp) with frontend and smart contracts. The application will be secure, user-friendly, and optimized for performance.",
    category: "Blockchain & Crypto",
    subcategory: "DApp Development",
    tags: ["dapp", "ethereum", "solana", "web3", "blockchain"],
    status: "inactive",
    packages: [
      {
        id: "pkg-4-1",
        name: "basic",
        description: "Simple DApp with basic functionality. Includes smart contract and minimal frontend.",
        deliveryTime: 7,
        revisions: 2,
        price: 1.5,
      },
      {
        id: "pkg-4-2",
        name: "standard",
        description:
          "Complete DApp with custom smart contracts and responsive frontend. Includes wallet integration and testing.",
        deliveryTime: 14,
        revisions: 3,
        price: 3.0,
      },
      {
        id: "pkg-4-3",
        name: "premium",
        description:
          "Enterprise DApp with complex functionality, advanced security, comprehensive testing, and deployment assistance.",
        deliveryTime: 30,
        revisions: 5,
        price: 6.0,
      },
    ],
    images: ["/placeholder.svg?height=300&width=500"],
    orders: 15,
    rating: 4.6,
    createdAt: "2023-06-10T11:45:00Z",
    updatedAt: "2023-09-15T13:30:00Z",
    featured: false,
  },
  {
    id: "gig-5",
    title: "I will create a marketing strategy for your crypto project",
    description:
      "I will develop a comprehensive marketing strategy to promote your cryptocurrency, NFT, or blockchain project. The strategy will focus on community building, social media, and growth hacking.",
    category: "Marketing",
    subcategory: "Content Marketing",
    tags: ["crypto marketing", "nft promotion", "social media", "community", "growth"],
    status: "pending_review",
    packages: [
      {
        id: "pkg-5-1",
        name: "basic",
        description: "Basic marketing plan with social media strategy and content calendar for 2 weeks.",
        deliveryTime: 3,
        revisions: 1,
        price: 0.7,
      },
      {
        id: "pkg-5-2",
        name: "standard",
        description:
          "Comprehensive marketing strategy with social media, community building, and influencer outreach for 1 month.",
        deliveryTime: 7,
        revisions: 2,
        price: 1.4,
      },
      {
        id: "pkg-5-3",
        name: "premium",
        description:
          "Complete marketing ecosystem with strategy, execution plan, KPIs, and growth hacking techniques for 3 months.",
        deliveryTime: 14,
        revisions: 3,
        price: 2.8,
      },
    ],
    images: ["/placeholder.svg?height=300&width=500"],
    orders: 9,
    rating: 4.5,
    createdAt: "2023-10-01T15:20:00Z",
    updatedAt: "2023-10-25T09:45:00Z",
    featured: false,
  },
]

import type { User as UserType, Order as OrderType, ActivityItem as Activity } from "./types"

export const mockUser: UserType = {
  id: "user-1",
  username: "alexsmith",
  displayName: "Alex Smith",
  email: "alex.smith@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
  isVerified: true,
  userType: "both",
}

export const mockOrders: OrderType[] = [
  {
    id: "order-1",
    title: "Logo Design for Crypto Startup",
    otherParty: {
      username: "sarahjones",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    price: 2.5,
    status: "in_progress",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  },
  {
    id: "order-2",
    title: "Smart Contract Development",
    otherParty: {
      username: "cryptodev",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    price: 5.0,
    status: "delivered",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
  },
  {
    id: "order-3",
    title: "Website Content Writing",
    otherParty: {
      username: "writerpro",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    price: 1.2,
    status: "in_progress",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
  },
]

export const mockActivities: Activity[] = [
  {
    id: "activity-1",
    type: "message",
    title: "New message from sarahjones",
    description:
      "Hi Alex, I've completed the first draft of the logo design. Please check it out and let me know your thoughts!",
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false,
    actionable: true,
    actionText: "Reply",
  },
  {
    id: "activity-2",
    type: "order",
    title: "Order delivered",
    description:
      "cryptodev has delivered the Smart Contract Development order. Please review the deliverables and provide feedback.",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    read: false,
    actionable: true,
    actionText: "Review",
  },
  {
    id: "activity-3",
    type: "payment",
    title: "Payment received",
    description: "You have received a payment of 1.8 SOL for the UI/UX Design project from techstartup.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: "activity-4",
    type: "review",
    title: "New 5-star review",
    description:
      'techstartup has left a 5-star review for your UI/UX Design service: "Alex delivered exceptional work! The design was exactly what we needed and the communication was excellent throughout the project."',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
  },
  {
    id: "activity-5",
    type: "system",
    title: "Account verified",
    description:
      "Your account has been successfully verified. You now have full access to all features of our platform.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    read: true,
  },
]

export const mockStats = {
  inProgress: 4,
  completed: 27,
  pending: 2,
  disputed: 0,
}

export const mockWallet = {
  balance: 12.5678,
  address: "8xGzLyH3hVLjUUjHPXGFMjCHEHAMfnAz23RFVxBvHLg5",
  pendingTransactions: 1,
}
