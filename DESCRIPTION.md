# Team Members

- Swan Htet Aung Phyo
- Aung Zayar Moe
- Michal Piotr Rawski
- Alexander Rosol

# GitHub Organisation Link for the Details Documentation

- [GitHub Organisation Documentation](GitHub Organisation Documentation)

# Marketplace

## Flow of the Application

1. User Registration & Account Setup

   - Users sign up on the platform and create an account.
   - Users must complete verification to enhance security and trust.
   - Every user has the ability to act as both a buyer and a seller.

2. Browsing & Searching

   - Users can search for freelance services using filters and categories.
   - Sellers can list their services or digital assets with detailed descriptions and pricing.

3. Buying & Selling

   - Buyers can browse listings, check reviews, and purchase services or assets.
   - Sellers receive order notifications and can manage transactions through their dashboard.

4. Payments & Transactions

   - Payments are processed securely via Stripe or other integrated payment gateways.
   - Funds are held in escrow until the transaction is successfully completed to ensure buyer and seller protection.

5. Order Completion & Delivery

   - For freelance services: Sellers complete and deliver the work to the buyer.
   - For digital assets: Buyers get instant access to the purchased assets.

6. Reviews & Ratings

   - After order completion, both buyers and sellers can leave ratings and reviews.
   - This helps establish credibility, trust, and a reliable marketplace.

7. Real-Time Chat

   - Buyers and sellers can communicate directly through a real-time chat feature using websockets.
   - This enhances collaboration and allows users to discuss project details efficiently.

8. Check the Authenticity of the Review on the Chain
   - Before making the purchasing and choosing the service, user can copy the transaction ID of the review and services History on the chain Scanner

## Tech Stack

### Frontend Tech Stack

| Category         | Technologies/Tools               |
| ---------------- | -------------------------------- |
| Framework        | Next.js (SSR/SSG)                |
| Form Handling    | React Hook Form + Zod Validation |
| UI Components    | ShadCN/UI, Radix UI (Primitives) |
| Authentication   | Auth.js (Session Management)     |
| State Management | React Context API / Zustand      |
| Styling          | Tailwind CSS                     |

Key Features

- Performance & SEO: SSR/SSG via Next.js.
- Validation: Client-side validation with Zod + React Hook Form.
- Dynamic UI: Modular components (ShadCN/UI)
- Authentication: Secure session management with Auth.js.

### Backend Tech Stack

| Category                    | Technologies/Tools                                         |
| --------------------------- | ---------------------------------------------------------- |
| Language                    | Go (Golang)                                                |
| API Framework               | RESTful API (Standard HTTP/JSON)                           |
| Microservices Communication | gRPC (High-performance RPC framework)                      |
| Primary Database            | PostgreSQL (Structured metadata storage)                   |
| Blob/File Storage           | Supabase Storage (For files, images, etc.)                 |
| Chat Data Storage           | MongoDB (NoSQL for unstructured chat messages)             |
| Caching                     | Redis (Session caching, rate limiting, etc.)               |
| Containerization            | Docker (Service isolation, scalability)                    |
| Real-Time Communication     | WebSocket (Chat application bidirectional messaging)       |
| ORM                         | GORM (Go Object-Relational Mapping for PostgreSQL)         |
| Authentication              | JWT/OAuth2 (Integrated with Auth.js on frontend)           |
| Documentation               | OpenAPI documentation (Swagger UI)                         |
| Secret Management           | HashiCorp Vault (Storing the Secret Key, e.g., JWT_Secret) |

Key Features

- Scalability: Microservices architecture with gRPC for inter-service communication.
- Performance: Goâ€™s concurrency model + Redis caching for low-latency responses.
- Data Diversity:
  - PostgreSQL for structured metadata (users, orders, profiles).
  - MongoDB for flexible chat message storage.
- Supabase for scalable blob/file storage.
- Real-Time Chat: WebSocket integration for instant messaging.
