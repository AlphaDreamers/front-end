"use client";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  Calendar,
  CircleDollarSign,
  Clock,
  ListChecks,
  MessageSquare,
  Package,
  Shield,
  Star,
  Wallet,
  Activity,
  Users,
  Settings,
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

// Mock data
const earningsData = [
  { month: "Jan", earnings: 0.42 },
  { month: "Feb", earnings: 0.87 },
  { month: "Mar", earnings: 0.76 },
  { month: "Apr", earnings: 1.28 },
  { month: "May", earnings: 0.95 },
  { month: "Jun", earnings: 1.52 },
];

const activeOrders = [
  {
    id: "ORD-1234",
    buyer: "Alex Chen",
    service: "Logo Design",
    dueDate: "2025-05-14",
    status: "IN_PROGRESS",
    price: "0.042 ETH",
  },
  {
    id: "ORD-5678",
    buyer: "Maria Lopez",
    service: "Website Redesign",
    dueDate: "2025-05-21",
    status: "REVISION",
    price: "0.18 ETH",
  },
  {
    id: "ORD-9012",
    buyer: "John Smith",
    service: "SEO Optimization",
    dueDate: "2025-05-16",
    status: "PENDING",
    price: "0.065 ETH",
  },
];

const recentMessages = [
  {
    id: 1,
    from: "Alex Chen",
    preview: "Can you send me a preview of the logo?",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    from: "Maria Lopez",
    preview: "I've reviewed your changes. Could we adjust...",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    from: "Support Team",
    preview: "Your verification is complete! You can now...",
    time: "1 day ago",
    unread: false,
  },
];

const cryptoBalances = [
  {
    crypto: "ETH",
    balance: 4.281,
    change: "+2.3%",
    fiatValue: "$14,231",
    icon: "⟠",
  },
  {
    crypto: "BTC",
    balance: 0.128,
    change: "+1.8%",
    fiatValue: "$7,980",
    icon: "₿",
  },
  {
    crypto: "SOL",
    balance: 32.5,
    change: "-0.7%",
    fiatValue: "$3,120",
    icon: "Ⓢ",
  },
];

export default function Dashboard() {
  const [view, setView] = useState("messages");

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-500">CryptoFreelance</h1>
          <p className="text-sm text-gray-400">
            Freelance marketplace with crypto
          </p>
        </div>

        <nav className="flex-1">
          <div className="mb-2">
            <button
              onClick={() => setView("dashboard")}
              className={`w-full flex items-center p-3 rounded-lg ${
                view === "dashboard"
                  ? "bg-green-900/50 text-green-400"
                  : "hover:bg-gray-800"
              }`}
            >
              <BarChart3 size={20} className="mr-3" />
              Dashboard
            </button>
          </div>

          <div className="mb-2">
            <button
              onClick={() => setView("orders")}
              className={`w-full flex items-center p-3 rounded-lg ${
                view === "orders"
                  ? "bg-green-900/50 text-green-400"
                  : "hover:bg-gray-800"
              }`}
            >
              <Package size={20} className="mr-3" />
              Orders
            </button>
          </div>

          <div className="mb-2">
            <button
              onClick={() => setView("gigs")}
              className={`w-full flex items-center p-3 rounded-lg ${
                view === "gigs"
                  ? "bg-green-900/50 text-green-400"
                  : "hover:bg-gray-800"
              }`}
            >
              <ListChecks size={20} className="mr-3" />
              My Gigs
            </button>
          </div>

          <div className="mb-2">
            <button
              onClick={() => setView("messages")}
              className={`w-full flex items-center p-3 rounded-lg ${
                view === "messages"
                  ? "bg-green-900/50 text-green-400"
                  : "hover:bg-gray-800"
              }`}
            >
              <MessageSquare size={20} className="mr-3" />
              Messages
              <span className="ml-auto bg-green-500 text-green-950 px-2 py-1 rounded-full text-xs font-bold">
                2
              </span>
            </button>
          </div>

          <div className="mb-2">
            <button
              onClick={() => setView("wallet")}
              className={`w-full flex items-center p-3 rounded-lg ${
                view === "wallet"
                  ? "bg-green-900/50 text-green-400"
                  : "hover:bg-gray-800"
              }`}
            >
              <Wallet size={20} className="mr-3" />
              Crypto Wallet
            </button>
          </div>

          <div className="mb-2">
            <button
              onClick={() => setView("badges")}
              className={`w-full flex items-center p-3 rounded-lg ${
                view === "badges"
                  ? "bg-green-900/50 text-green-400"
                  : "hover:bg-gray-800"
              }`}
            >
              <Shield size={20} className="mr-3" />
              Badges & Skills
            </button>
          </div>

          <div className="mb-2">
            <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800">
              <Settings size={20} className="mr-3" />
              Settings
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-800">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-800 mr-3 flex items-center justify-center">
              <span className="text-green-200 font-semibold">JS</span>
            </div>
            <div>
              <div className="font-medium">Jane Smith</div>
              <div className="text-sm text-gray-400">Level 3 Seller</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-900 p-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-800">
          <h2 className="text-xl font-semibold">Dashboard</h2>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-800 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>

            <div className="bg-gray-800 rounded-xl px-4 py-2 flex items-center">
              <Wallet size={18} className="text-green-500 mr-2" />
              <span className="font-medium">4.281 ETH</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Earnings</p>
                  <h3 className="text-2xl font-bold">1.52 ETH</h3>
                  <p className="text-green-500 text-sm">+16% from May</p>
                </div>
                <div className="p-3 rounded-lg bg-green-900/30">
                  <CircleDollarSign size={24} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Active Orders</p>
                  <h3 className="text-2xl font-bold">7</h3>
                  <p className="text-amber-500 text-sm">2 need attention</p>
                </div>
                <div className="p-3 rounded-lg bg-green-900/30">
                  <Package size={24} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <h3 className="text-2xl font-bold flex items-center">
                    4.8
                    <Star
                      size={18}
                      className="text-amber-400 ml-1 inline"
                      fill="#FFC107"
                    />
                  </h3>
                  <p className="text-gray-400 text-sm">from 156 reviews</p>
                </div>
                <div className="p-3 rounded-lg bg-green-900/30">
                  <Star size={24} className="text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Response Time</p>
                  <h3 className="text-2xl font-bold">2.5 hrs</h3>
                  <p className="text-green-500 text-sm">Faster than 80%</p>
                </div>
                <div className="p-3 rounded-lg bg-green-900/30">
                  <Clock size={24} className="text-green-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Earnings Chart */}
            <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Earnings Overview</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Last 6 months</span>
                  <button className="text-green-500 hover:text-green-400 text-sm">
                    View All
                  </button>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="month"
                      stroke="#6B7280"
                      tick={{ fill: "#6B7280" }}
                    />
                    <YAxis
                      stroke="#6B7280"
                      tick={{ fill: "#6B7280" }}
                      tickFormatter={(value) => `${value} ETH`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "0.5rem",
                        color: "#F9FAFB",
                      }}
                      formatter={(value) => [`${value} ETH`, "Earnings"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: "#10B981", r: 4 }}
                      activeDot={{
                        fill: "#10B981",
                        r: 6,
                        stroke: "#064E3B",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Recent Messages</h3>
                <button className="text-green-500 hover:text-green-400 text-sm">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.unread
                        ? "bg-green-900/20 border border-green-900/40"
                        : "bg-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{message.from}</h4>
                      <span className="text-xs text-gray-400">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 truncate">
                      {message.preview}
                    </p>
                    {message.unread && (
                      <span className="inline-block mt-2 px-2 py-1 rounded-full bg-green-900/40 text-green-400 text-xs">
                        New message
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Crypto Wallet Section */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Crypto Wallet</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm">
                  Deposit
                </button>
                <button className="px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm">
                  Withdraw
                </button>
              </div>
            </div>

            {/* Crypto Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cryptoBalances.map((crypto) => (
                <div
                  key={crypto.crypto}
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 flex items-center justify-center text-xl">
                    {crypto.icon}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{crypto.crypto}</h4>
                      <span
                        className={`ml-2 text-xs ${
                          crypto.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {crypto.change}
                      </span>
                    </div>
                    <p className="text-xl font-bold">{crypto.balance}</p>
                    <p className="text-xs text-gray-400">{crypto.fiatValue}</p>
                  </div>
                  <div className="ml-auto">
                    <Activity size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-lg bg-green-900/20 border border-green-900/40">
              <div className="flex items-center">
                <Shield size={20} className="text-green-500 mr-2" />
                <span className="text-green-400 font-medium">
                  Wallet Security: Strong
                </span>
                <button className="ml-auto text-sm text-green-500 hover:text-green-400">
                  Security Settings
                </button>
              </div>
            </div>
          </div>

          {/* Active Orders Table */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Active Orders</h3>
              <button className="text-green-500 hover:text-green-400 text-sm">
                View All Orders
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-3 text-gray-400 font-medium">Order ID</th>
                    <th className="pb-3 text-gray-400 font-medium">Buyer</th>
                    <th className="pb-3 text-gray-400 font-medium">Service</th>
                    <th className="pb-3 text-gray-400 font-medium">Due Date</th>
                    <th className="pb-3 text-gray-400 font-medium">Status</th>
                    <th className="pb-3 text-gray-400 font-medium">Price</th>
                    <th className="pb-3 text-gray-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-800/50">
                      <td className="py-4 text-sm">{order.id}</td>
                      <td className="py-4 text-sm">{order.buyer}</td>
                      <td className="py-4 text-sm">{order.service}</td>
                      <td className="py-4 text-sm flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {order.dueDate}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "IN_PROGRESS"
                              ? "bg-blue-900/40 text-blue-400"
                              : order.status === "REVISION"
                              ? "bg-amber-900/40 text-amber-400"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium">
                        {order.price}
                      </td>
                      <td className="py-4">
                        <button className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg text-sm transition-colors">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Badges & Skills Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured Badges */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Your Featured Badges</h3>
                <button className="text-green-500 hover:text-green-400 text-sm">
                  Manage
                </button>
              </div>

              <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-2">
                    <Shield size={32} className="text-gray-900" />
                  </div>
                  <span className="text-sm font-medium">Quick Responder</span>
                  <span className="text-xs text-amber-400">GOLD</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-2">
                    <Star size={32} className="text-gray-900" />
                  </div>
                  <span className="text-sm font-medium">Top Rated</span>
                  <span className="text-xs text-green-400">PLATINUM</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-2">
                    <BarChart3 size={32} className="text-gray-900" />
                  </div>
                  <span className="text-sm font-medium">Trending</span>
                  <span className="text-xs text-blue-400">SILVER</span>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
                <button className="text-green-500 hover:text-green-400 text-sm">
                  View Calendar
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                  <div className="p-2 rounded-lg bg-red-900/30 mr-3">
                    <Calendar size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Logo Design for Alex</h4>
                    <p className="text-sm text-gray-400">Due in 2 days</p>
                  </div>
                  <span className="bg-red-900/20 text-red-400 px-2 py-1 rounded text-xs">
                    Urgent
                  </span>
                </div>

                <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                  <div className="p-2 rounded-lg bg-amber-900/30 mr-3">
                    <Calendar size={20} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Website Redesign</h4>
                    <p className="text-sm text-gray-400">Due in 5 days</p>
                  </div>
                  <span className="bg-amber-900/20 text-amber-400 px-2 py-1 rounded text-xs">
                    Medium
                  </span>
                </div>

                <div className="flex items-center p-3 bg-gray-800 rounded-lg">
                  <div className="p-2 rounded-lg bg-green-900/30 mr-3">
                    <Calendar size={20} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">SEO Optimization</h4>
                    <p className="text-sm text-gray-400">Due in 9 days</p>
                  </div>
                  <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded text-xs">
                    Planned
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Community section */}
          <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Community Insights</h3>
              <button className="text-green-500 hover:text-green-400 text-sm">
                Explore Community
              </button>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-gray-800 border border-gray-700">
              <div className="p-3 rounded-lg bg-green-900/30 mr-4">
                <Users size={24} className="text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">
                  Join the Crypto Freelancers Guild
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  Connect with 3,421 other freelancers accepting crypto payments
                </p>
              </div>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
                Join Now
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
