import {
  Code,
  PenTool,
  Camera,
  Music,
  FileText,
  BarChart,
  Smartphone,
  Globe,
  Video,
  Briefcase,
  type LucideIcon,
} from "lucide-react"

export interface FeaturedGig {
  id: string
  title: string
  image: string
  featured: boolean
  seller: {
    name: string
    avatar: string
  }
  rating: number
  reviewCount: number
  price: {
    amount: number
    currency: string
  }
}

export interface Category {
  id: string
  name: string
  icon: LucideIcon
  gigCount: number
}

export interface Testimonial {
  id: string
  quote: string
  user: {
    name: string
    avatar: string
    role: string
  }
}

export const featuredGigs: FeaturedGig[] = [
  {
    id: "1",
    title: "I will create a responsive website with Next.js and Tailwind",
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    seller: {
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 4.9,
    reviewCount: 127,
    price: {
      amount: 0.5,
      currency: "SOL",
    },
  },
  {
    id: "2",
    title: "I will design a modern logo for your brand or business",
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    seller: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 4.8,
    reviewCount: 94,
    price: {
      amount: 0.3,
      currency: "SOL",
    },
  },
  {
    id: "3",
    title: "I will develop a smart contract for your NFT collection",
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
    seller: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 5.0,
    reviewCount: 56,
    price: {
      amount: 0.8,
      currency: "SOL",
    },
  },
  {
    id: "4",
    title: "I will create professional social media content for your business",
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    seller: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 4.7,
    reviewCount: 83,
    price: {
      amount: 0.2,
      currency: "SOL",
    },
  },
  {
    id: "5",
    title: "I will create a custom 3D animation for your project",
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    seller: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 4.9,
    reviewCount: 42,
    price: {
      amount: 0.6,
      currency: "SOL",
    },
  },
  {
    id: "6",
    title: "I will write SEO-optimized content for your website",
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
    seller: {
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 4.8,
    reviewCount: 71,
    price: {
      amount: 0.25,
      currency: "SOL",
    },
  },
]

export const categories: Category[] = [
  {
    id: "1",
    name: "Web Development",
    icon: Code,
    gigCount: 1243,
  },
  {
    id: "2",
    name: "Graphic Design",
    icon: PenTool,
    gigCount: 875,
  },
  {
    id: "3",
    name: "Photography",
    icon: Camera,
    gigCount: 562,
  },
  {
    id: "4",
    name: "Music & Audio",
    icon: Music,
    gigCount: 421,
  },
  {
    id: "5",
    name: "Writing",
    icon: FileText,
    gigCount: 683,
  },
  {
    id: "6",
    name: "Marketing",
    icon: BarChart,
    gigCount: 529,
  },
  {
    id: "7",
    name: "Mobile Apps",
    icon: Smartphone,
    gigCount: 347,
  },
  {
    id: "8",
    name: "Web3 & NFTs",
    icon: Globe,
    gigCount: 298,
  },
  {
    id: "9",
    name: "Video & Animation",
    icon: Video,
    gigCount: 412,
  },
  {
    id: "10",
    name: "Business",
    icon: Briefcase,
    gigCount: 376,
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "This platform has completely transformed how I find clients. The Solana integration makes payments instant and secure. I've increased my client base by 300% since joining!",
    user: {
      name: "James Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Freelance Developer",
    },
  },
  {
    id: "2",
    quote:
      "As someone who hires freelancers regularly, I love the security and anonymity that comes with Solana payments. The talent pool is exceptional, and I've found amazing professionals for all my projects.",
    user: {
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Startup Founder",
    },
  },
  {
    id: "3",
    quote:
      "The transaction fees are minimal compared to other platforms, and I get paid instantly. This marketplace has become my primary source of income as a freelance designer.",
    user: {
      name: "Daniel Jackson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "UI/UX Designer",
    },
  },
]
