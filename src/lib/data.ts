export type Skill = {
  name: string;
  level: number;
  maxLevel: number;
};

export type Certificate = {
  name: string;
  issuer: string;
  date: string;
  verified: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
};

export type Review = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  text: string;
};

export type Gig = {
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  deliveryTime: string;
  image: string;
  category: string;
};

export type UserProfile = {
  username: string;
  displayName: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  memberSince: string;
  kycVerified: boolean;
  responseTime: string;
  lastActive: string;
  skills: Skill[];
  certificates: Certificate[];
  badges: Badge[];
  reviews: Review[];
  gigs: Gig[];
  stats: {
    completedJobs: number;
    onTimeDelivery: number;
    totalEarnings: number;
    avgRating: number;
  };
  type: "seller" | "buyer" | "both";
};

export const mockUserProfile: UserProfile = {
  username: "cryptodev",
  displayName: "Alex Morgan",
  avatar: "/placeholder.svg?height=200&width=200",
  coverImage: "/placeholder.svg?height=400&width=1200",
  bio: "Full-stack developer specializing in blockchain and Web3 technologies. I build secure, scalable applications for the decentralized web. Over 5 years of experience working with React, Node.js, and Solidity.",
  location: "San Francisco, CA",
  memberSince: "May 2021",
  kycVerified: true,
  responseTime: "< 2 hours",
  lastActive: "2 hours ago",
  skills: [
    { name: "JavaScript", level: 5, maxLevel: 5 },
    { name: "React", level: 4, maxLevel: 5 },
    { name: "Solidity", level: 5, maxLevel: 5 },
    { name: "Node.js", level: 4, maxLevel: 5 },
    { name: "TypeScript", level: 4, maxLevel: 5 },
    { name: "Web3.js", level: 5, maxLevel: 5 },
    { name: "Smart Contracts", level: 5, maxLevel: 5 },
    { name: "DApp Development", level: 4, maxLevel: 5 },
  ],
  certificates: [
    {
      name: "Certified Blockchain Developer",
      issuer: "Blockchain Council",
      date: "2022-03-15",
      verified: true,
    },
    {
      name: "Advanced React & Redux",
      issuer: "Udemy",
      date: "2021-08-10",
      verified: true,
    },
    {
      name: "Ethereum and Solidity: The Complete Developer's Guide",
      issuer: "Coursera",
      date: "2021-05-22",
      verified: true,
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
    {
      id: "blockchain-expert",
      name: "Blockchain Wizard",
      description: "Expert in blockchain technologies",
      icon: "link",
      rarity: "epic",
    },
    {
      id: "rising-talent",
      name: "Rising Talent",
      description: "Quickly gaining popularity on the platform",
      icon: "trending-up",
      rarity: "common",
    },
    {
      id: "crypto-pioneer",
      name: "Crypto Pioneer",
      description: "Early adopter of cryptocurrency payments",
      icon: "bitcoin",
      rarity: "legendary",
    },
  ],
  reviews: [
    {
      id: "rev1",
      author: {
        name: "Sarah J.",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      rating: 5,
      date: "2023-04-15",
      text: "Alex delivered the smart contract ahead of schedule and it passed all our security audits. Excellent communication throughout the project.",
    },
    {
      id: "rev2",
      author: {
        name: "Michael T.",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      rating: 5,
      date: "2023-03-22",
      text: "Built an amazing DApp for our NFT marketplace. The code was clean, well-documented, and exactly what we needed. Will definitely hire again!",
    },
    {
      id: "rev3",
      author: {
        name: "Jessica L.",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      rating: 4,
      date: "2023-02-10",
      text: "Great developer who knows blockchain inside and out. The only reason for 4 stars instead of 5 is that we had to make a few revisions to the UI.",
    },
  ],
  gigs: [
    {
      id: "gig1",
      title: "Develop a Custom Smart Contract for Your Project",
      description:
        "I will create a secure, audited smart contract tailored to your specific needs.",
      price: {
        amount: 0.5,
        currency: "ETH",
      },
      deliveryTime: "3 days",
      image: "/placeholder.svg?height=200&width=300",
      category: "Blockchain",
    },
    {
      id: "gig2",
      title: "Build a Full-Stack DApp with React and Solidity",
      description:
        "Get a complete decentralized application with frontend and smart contracts.",
      price: {
        amount: 1.2,
        currency: "ETH",
      },
      deliveryTime: "7 days",
      image: "/placeholder.svg?height=200&width=300",
      category: "Web3",
    },
    {
      id: "gig3",
      title: "NFT Collection Development and Deployment",
      description:
        "I will create and deploy your NFT collection on Ethereum, Polygon, or Solana.",
      price: {
        amount: 0.8,
        currency: "ETH",
      },
      deliveryTime: "5 days",
      image: "/placeholder.svg?height=200&width=300",
      category: "NFT",
    },
  ],
  stats: {
    completedJobs: 47,
    onTimeDelivery: 98,
    totalEarnings: 25.4,
    avgRating: 4.9,
  },
  type: "seller",
};
