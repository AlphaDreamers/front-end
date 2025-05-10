"use client";
import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Settings,
  User,
  Search,
  DollarSign,
  Star,
  ChevronDown,
  Clock,
  PieChart,
  Activity,
  TrendingUp,
  Briefcase,
  Award,
  Shield,
  Tag,
  Wallet,
  HelpCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for charts
const earningsData = [
  { name: "May 1", earnings: 125 },
  { name: "May 2", earnings: 210 },
  { name: "May 3", earnings: 175 },
  { name: "May 4", earnings: 320 },
  { name: "May 5", earnings: 250 },
  { name: "May 6", earnings: 290 },
  { name: "May 7", earnings: 380 },
];

const badges = [
  {
    name: "Fast Delivery",
    tier: "GOLD",
    icon: <Clock size={16} className="mr-1" />,
  },
  {
    name: "Top Rated",
    tier: "PLATINUM",
    icon: <Star size={16} className="mr-1" />,
  },
  {
    name: "Verified",
    tier: "DIAMOND",
    icon: <Shield size={16} className="mr-1" />,
  },
];

const activeOrders = [
  {
    id: "ord-123",
    title: "Logo Design",
    buyer: "alexsmith",
    price: "0.05 ETH",
    dueDate: "May 14, 2025",
    status: "IN_PROGRESS",
  },
  {
    id: "ord-124",
    title: "Web Development",
    buyer: "jennyk",
    price: "0.25 ETH",
    dueDate: "May 20, 2025",
    status: "PENDING",
  },
  {
    id: "ord-125",
    title: "Content Writing",
    buyer: "mikebrown",
    price: "0.04 ETH",
    dueDate: "May 12, 2025",
    status: "REVISION",
  },
];

const walletInfo = {
  balance: "0.85 ETH",
  equivalent: "$2,457.50 USD",
  transactions: [
    { type: "Received", amount: "+0.25 ETH", date: "May 7", from: "jennyk" },
    {
      type: "Withdrawal",
      amount: "-0.50 ETH",
      date: "May 5",
      to: "External Wallet",
    },
    { type: "Received", amount: "+0.05 ETH", date: "May 3", from: "alexsmith" },
  ],
};

const recentMessages = [
  {
    sender: "alexsmith",
    preview: "Hey, I was wondering about the logo design...",
    time: "2h ago",
  },
  {
    sender: "jennyk",
    preview: "Can we discuss the website project?",
    time: "5h ago",
  },
  {
    sender: "mikebrown",
    preview: "I've reviewed your latest draft and...",
    time: "8h ago",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-green-500">CryptoLance</h1>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search gigs, users, or skills..."
              className="w-full pl-8 pr-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-800 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 relative">
            <MessageSquare size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-md">
            <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center">
              <User size={16} />
            </div>
            <span>johndoe</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                    activeTab === "overview"
                      ? "bg-green-900/50 text-green-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <PieChart size={18} />
                  <span>Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                    activeTab === "orders"
                      ? "bg-green-900/50 text-green-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Briefcase size={18} />
                  <span>Active Orders</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("earnings")}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                    activeTab === "earnings"
                      ? "bg-green-900/50 text-green-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <TrendingUp size={18} />
                  <span>Earnings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                    activeTab === "messages"
                      ? "bg-green-900/50 text-green-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <MessageSquare size={18} />
                  <span>Messages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("wallet")}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                    activeTab === "wallet"
                      ? "bg-green-900/50 text-green-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Wallet size={18} />
                  <span>Crypto Wallet</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("gigs")}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                    activeTab === "gigs"
                      ? "bg-green-900/50 text-green-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Tag size={18} />
                  <span>My Gigs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("badges")}
                  className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                    activeTab === "badges"
                      ? "bg-green-900/50 text-green-400"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Award size={18} />
                  <span>Badges & Skills</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <Settings size={18} />
              <span>Settings</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <HelpCircle size={18} />
              <span>Help & Support</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Active Orders</h3>
                <Briefcase size={18} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold">3</p>
              <div className="text-xs text-green-400 mt-2 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                <span>+2 from last week</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">
                  This Week&apos;s Earnings
                </h3>
                <DollarSign size={18} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold">0.35 ETH</p>
              <div className="text-xs text-green-400 mt-2 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                <span>+0.12 ETH from last week</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Average Rating</h3>
                <Star size={18} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold">4.9/5.0</p>
              <div className="text-xs text-green-400 mt-2">
                Based on 42 reviews
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Wallet Balance</h3>
                <Wallet size={18} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold">{walletInfo.balance}</p>
              <div className="text-xs text-gray-400 mt-2">
                {walletInfo.equivalent}
              </div>
            </div>
          </div>

          {/* Earnings Chart and Badge Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Earnings Overview</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs rounded-md bg-green-600 hover:bg-green-700">
                    Week
                  </button>
                  <button className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600">
                    Month
                  </button>
                  <button className="px-3 py-1 text-xs rounded-md bg-gray-700 hover:bg-gray-600">
                    Year
                  </button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                      }}
                      itemStyle={{ color: "#D1D5DB" }}
                      labelStyle={{ color: "#D1D5DB" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#10B981" }}
                      activeDot={{ r: 6, fill: "#10B981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-semibold mb-4 flex items-center">
                <Award size={18} className="text-green-400 mr-2" />
                Featured Badges
              </h3>
              <div className="space-y-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-900 rounded-md border border-gray-700"
                  >
                    <div
                      className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center ${
                        badge.tier === "GOLD"
                          ? "bg-yellow-700"
                          : badge.tier === "PLATINUM"
                          ? "bg-gray-400"
                          : badge.tier === "DIAMOND"
                          ? "bg-blue-700"
                          : "bg-green-700"
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-gray-400">{badge.tier} Tier</p>
                    </div>
                  </div>
                ))}
                <button className="text-sm text-green-400 hover:text-green-300 flex items-center mt-2">
                  <ChevronDown size={16} className="mr-1" />
                  View all badges
                </button>
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold flex items-center">
                <Clock size={18} className="text-green-400 mr-2" />
                Active Orders
              </h3>
              <button className="text-sm text-green-400 hover:text-green-300">
                View all orders
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Buyer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-3 px-4 text-sm">{order.id}</td>
                      <td className="py-3 px-4">{order.title}</td>
                      <td className="py-3 px-4 text-sm">{order.buyer}</td>
                      <td className="py-3 px-4 text-sm font-medium text-green-400">
                        {order.price}
                      </td>
                      <td className="py-3 px-4 text-sm">{order.dueDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "IN_PROGRESS"
                              ? "bg-blue-900 text-blue-300"
                              : order.status === "PENDING"
                              ? "bg-yellow-900 text-yellow-300"
                              : order.status === "REVISION"
                              ? "bg-purple-900 text-purple-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Messages and Wallet Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold flex items-center">
                  <MessageSquare size={18} className="text-green-400 mr-2" />
                  Recent Messages
                </h3>
                <button className="text-sm text-green-400 hover:text-green-300">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-gray-900 rounded-md hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-green-700 flex items-center justify-center mr-3">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{message.sender}</p>
                        <span className="text-xs text-gray-400">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold flex items-center">
                  <Activity size={18} className="text-green-400 mr-2" />
                  Recent Transactions
                </h3>
                <button className="text-sm text-green-400 hover:text-green-300">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {walletInfo.transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-md"
                  >
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center ${
                          transaction.type === "Received"
                            ? "bg-green-700"
                            : "bg-red-700"
                        }`}
                      >
                        {transaction.type === "Received" ? (
                          <DollarSign size={16} />
                        ) : (
                          <Wallet size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.type}</p>
                        <p className="text-xs text-gray-400">
                          {transaction.type === "Received"
                            ? `From: ${transaction.from}`
                            : `To: ${transaction.to}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.type === "Received"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.amount}
                      </p>
                      <p className="text-xs text-gray-400">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
