import type { Conversation, Message } from "./types"

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    contact: {
      id: "user-2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
      isOnline: true,
    },
    lastMessage: "I've completed the first draft of the logo design. Please check it out!",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    unreadCount: 2,
    hasAttachment: true,
    isOrderRelated: true,
    orderId: "order-1",
  },
  {
    id: "conv-2",
    contact: {
      id: "user-3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
    },
    lastMessage: "When can we discuss the project requirements?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: "conv-3",
    contact: {
      id: "user-4",
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
    },
    lastMessage: "Thanks for delivering the smart contract. It works perfectly!",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    unreadCount: 0,
    isOrderRelated: true,
    orderId: "order-3",
  },
  {
    id: "conv-4",
    contact: {
      id: "user-5",
      name: "Jessica Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
    },
    lastMessage: "I need some revisions on the article. Can we discuss?",
    lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    unreadCount: 1,
  },
  {
    id: "conv-5",
    contact: {
      id: "user-6",
      name: "David Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: false,
    },
    lastMessage: "Here's the NFT collection you requested. Let me know what you think!",
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    unreadCount: 0,
    hasAttachment: true,
  },
  {
    id: "conv-6",
    contact: {
      id: "user-7",
      name: "Olivia Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
      isVerified: true,
    },
    lastMessage: "I've sent you the marketing strategy document. Please review it.",
    lastMessageTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    unreadCount: 0,
    hasAttachment: true,
  },
]

export const mockMessages: { [conversationId: string]: Message[] } = {
  "conv-1": [
    {
      id: "msg-1-1",
      type: "received",
      content:
        "Hi there! I'm interested in your logo design service. Can you help me create a logo for my crypto startup?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-1-2",
      type: "sent",
      content:
        "Hello Sarah! I'd be happy to help you with your logo design. Could you tell me more about your startup and what kind of logo you're looking for?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 15 minutes after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-1-3",
      type: "received",
      content:
        "We're building a DeFi platform called 'CryptoFlow' that focuses on cross-chain liquidity. We want a modern, sleek logo that represents the flow of assets across different blockchains.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 minutes after previous message
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-1-4",
      type: "sent",
      content:
        "That sounds interesting! I think I can create something that captures the essence of your platform. Would you prefer a text-based logo, a symbol, or a combination of both?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-1-5",
      type: "received",
      content:
        "I'd like a combination of both - a symbol that can stand alone but also works well with the text 'CryptoFlow'. Our brand colors are purple and teal.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 1.5 hours after previous message
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      orderAction: {
        orderId: "order-1",
        title: "Logo Design for CryptoFlow",
        price: 2.5,
        actionText: "View Order Details",
      },
    },
    {
      id: "msg-1-6",
      type: "sent",
      content:
        "Perfect! I'll create a few concepts based on your requirements. I'll have the initial drafts ready in 2-3 days. Is there anything else you'd like me to know about the project?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(), // 2 hours after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-1-7",
      type: "received",
      content:
        "That sounds great! One more thing - we'd like the logo to work well on both light and dark backgrounds since our app will have both themes.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-1-8",
      type: "sent",
      content:
        "Noted! I'll make sure the logo works well on both light and dark backgrounds. I'll get started right away.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 minutes after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-1-9",
      type: "received",
      content: "I've completed the first draft of the logo design. Please check it out!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      attachments: [
        {
          name: "cryptoflow_logo_draft.png",
          url: "#",
          type: "image/png",
          size: 1240000,
        },
        {
          name: "cryptoflow_logo_variations.pdf",
          url: "#",
          type: "application/pdf",
          size: 2560000,
        },
      ],
    },
    {
      id: "msg-1-10",
      type: "received",
      content:
        "I've also included a PDF with different variations and applications of the logo. Let me know what you think!",
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
      sender: {
        id: "user-2",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      type: "received",
      content: "Hello, I'm interested in your smart contract development service. I have a project in mind.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      sender: {
        id: "user-3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-2",
      type: "sent",
      content:
        "Hi Michael! I'd be happy to help with your smart contract development. Could you share more details about your project?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 minutes after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-3",
      type: "received",
      content:
        "I'm working on a decentralized marketplace for digital art. I need a smart contract that handles the listing, buying, and selling of NFTs with royalties for the original creators.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      sender: {
        id: "user-3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-4",
      type: "sent",
      content:
        "That sounds like an interesting project! I have experience with NFT marketplaces and royalty systems. Are you planning to deploy on Ethereum, Solana, or another blockchain?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 minutes after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-5",
      type: "received",
      content:
        "We're planning to deploy on Solana for the lower transaction fees and higher throughput. Would that work for you?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours after previous message
      sender: {
        id: "user-3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-6",
      type: "sent",
      content:
        "Yes, I'm proficient with Solana development. I can create a smart contract that handles all the marketplace functionality you need. Would you like to schedule a call to discuss the details further?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-7",
      type: "received",
      content: "That would be great. How about tomorrow at 2 PM EST?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours after previous message
      sender: {
        id: "user-3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-8",
      type: "sent",
      content: "Tomorrow at 2 PM EST works for me. I'll send you a calendar invite with a video call link.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4.5 * 60 * 60 * 1000).toISOString(), // 4.5 hours after previous message
      isRead: true,
      sender: {
        id: "user-1",
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "msg-2-9",
      type: "received",
      content: "When can we discuss the project requirements?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      sender: {
        id: "user-3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
}

export const currentUser = {
  id: "user-1",
  name: "Alex Morgan",
  avatar: "/placeholder.svg?height=40&width=40",
}
