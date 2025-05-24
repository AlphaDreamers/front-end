export const personalInfoData = {
  displayName: "Alex Johnson",
  email: "alex.johnson@example.com",
  username: "alexj",
  bio: "Experienced web developer specializing in React and Node.js. I create responsive, user-friendly applications with clean code and modern design principles.",
}

export const walletData = {
  address: "8ZUgCkZHUFxPRYBjEJSuiVXgEtXhsW7YYEjXHtHRBYyZ",
  balance: 12.45,
}

export const notificationSettings = [
  {
    id: "new-order",
    title: "New Orders",
    description: "Receive notifications when you get a new order.",
    emailEnabled: true,
    appEnabled: true,
  },
  {
    id: "order-updates",
    title: "Order Updates",
    description: "Get notified about status changes to your orders.",
    emailEnabled: true,
    appEnabled: true,
  },
  {
    id: "messages",
    title: "Messages",
    description: "Receive notifications for new messages.",
    emailEnabled: true,
    appEnabled: true,
  },
  {
    id: "reviews",
    title: "Reviews",
    description: "Get notified when someone leaves a review.",
    emailEnabled: true,
    appEnabled: false,
  },
  {
    id: "payments",
    title: "Payments",
    description: "Receive notifications about payments and withdrawals.",
    emailEnabled: true,
    appEnabled: true,
  },
  {
    id: "promotions",
    title: "Promotions & Updates",
    description: "Get updates about platform features and promotions.",
    emailEnabled: false,
    appEnabled: true,
  },
]

export const securityData = {
  twoFactorEnabled: false,
}
