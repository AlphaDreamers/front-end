# Docker Setup Guide

This guide explains how to build and run the Next.js application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Desktop running (if using macOS/Windows)

## Build the Docker Image

1. Open terminal in the project root directory (ss2025-rawski-aung-rosol-zayar/src)
2. Build the Docker image:
   ```bash
   docker build -t my-nextjs-app .
   ```

## Run the Container

1. Start the container:

   ```bash
   docker run -p 3000:3000 my-nextjs-app
   ```

## Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. If you used a different port, use that port instead (e.g., `http://localhost:3001`)

## Stopping the Container

- Press `Ctrl+C` in the terminal where the container is running
- Or run `docker stop <container-id>` in another terminal

### Application Not Loading

- Wait a few seconds after "Ready on http://localhost:3000" appears
- Check if there are any error messages in the terminal
- Try refreshing the browser page

# Extended Setup Guide

This guide provides comprehensive instructions for setting up the complete development environment with all third-party services. The standard setup process automatically copies environment variables from the example file, but to complete the proccess yourself manually you'll need to configure multiple external services.

## Prerequisites

Before proceeding with the extended setup, ensure you have completed the basic installation:

- PostgreSQL client tools installed - if using local database
- Git configured
- ngrok account (for webhook testing)

## 1. Email Service Configuration (Resend)

### Step 1.1: Create Resend Account

1. Navigate to [resend.com](https://resend.com)
2. Sign up for a new account using your development email
3. Verify your email address through the confirmation link
4. Complete the account verification process

### Step 1.2: Generate API Key

1. Access the Resend dashboard
2. Navigate to "API Keys" section in the sidebar
3. Click "Create API Key"
4. Provide a descriptive name (e.g., "Development Environment")
5. Select appropriate permissions (Send emails)
6. Copy the generated API key (starts with `re_`)

### Step 1.3: Configure Email Settings

1. For development, you must use the default sender: `"Acme <onboarding@resend.dev>"`
2. Add your development email to the Resend verified senders list
3. Update your `.env` file:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   FROM_EMAIL="Acme <onboarding@resend.dev>"
   ```

## 2. Media Storage Configuration (Cloudinary)

### Step 2.1: Account Registration

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a new account with your email
3. Verify email and complete profile setup
4. Access your dashboard to retrieve credentials

### Step 2.2: Configure Upload Folders

Navigate to Settings > Upload and create the following folder structure:

1. **users/avatars** - For user profile pictures
   - Set upload preset to `unsigned`
2. **users/banners** - For user banner images
   - Set upload preset to `unsigned`
3. **chats/media** - For chat attachments
   - Set upload preset to `unsigned`
4. **gigs/images** - For service listing images
   - Set upload preset to `unsigned`

### Step 2.3: Retrieve API Credentials

1. From the dashboard, navigate to Settings > Security
2. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret
3. Update your `.env` file:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## 3. Payment Processing Configuration (Stripe)

### Step 3.1: Stripe Account Setup

1. Visit [stripe.com](https://stripe.com)
2. Create a new account
3. Enable test mode for development

### Step 3.2: Retrieve Test API Keys

1. Navigate to Developers > API keys
2. Copy the following test keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)
3. Update your `.env` file:
   ```
   STRIPE_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
   ```

### Step 3.3: Webhook Configuration with ngrok

#### Install and Setup ngrok - stripe webhooks cannot work on localhost:3000 this is the only way to enable them outside of custom domains on the web

1. Download ngrok from [ngrok.com](https://ngrok.com)
2. Sign up for a free account
3. Install ngrok globally: `npm install -g ngrok`
4. Authenticate: `ngrok authtoken YOUR_AUTH_TOKEN`

#### Configure Stripe Webhooks

1. Start your development server: `npm run dev`
2. In a new terminal, expose your local server: `ngrok http 3000`
3. Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok.io`)
4. In Stripe Dashboard, go to Developers > Webhooks
5. Click "Add endpoint"
6. Set endpoint URL: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
7. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
8. Save the endpoint and copy the signing secret
9. Update your `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## 4. Database Configuration

You have two options for database setup: using Neon (recommended) or restoring from a local backup.

### Option 4.1: Neon Database Setup (Recommended)

#### Step 4.1.1: Create Neon Account

1. Visit [neon.tech](https://neon.tech)
2. Sign up using GitHub or email
3. Create a new project
4. Choose your preferred region (eu-central-1 recommended)

#### Step 4.1.2: Database Configuration

1. Create a new database named `neondb`
2. Generate a strong password
3. Copy the connection strings from the dashboard
4. Use the provided configuration template:

```env
DATABASE_URL=postgres://username:password@hostname-pooler.region.aws.neon.tech/database_name?sslmode=require
DATABASE_URL_UNPOOLED=postgres://username:password@hostname.region.aws.neon.tech/database_name?sslmode=require
PGHOST=hostname-pooler.region.aws.neon.tech
PGHOST_UNPOOLED=hostname.region.aws.neon.tech
PGUSER=username
PGDATABASE=database_name
PGPASSWORD=password
POSTGRES_URL=postgres://username:password@hostname-pooler.region.aws.neon.tech/database_name?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://username:password@hostname.region.aws.neon.tech/database_name?sslmode=require
POSTGRES_USER=username
POSTGRES_HOST=hostname-pooler.region.aws.neon.tech
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database_name
POSTGRES_URL_NO_SSL=postgres://username:password@hostname-pooler.region.aws.neon.tech/database_name
POSTGRES_PRISMA_URL=postgres://username:password@hostname.region.aws.neon.tech/database_name?connect_timeout=15&sslmode=require
```

### Option 4.2: Local Database Restoration

If you prefer to use a local PostgreSQL instance with the provided database backup:

#### Step 4.2.1: Install PostgreSQL

1. Install PostgreSQL 17 on your system
2. Start the PostgreSQL service
3. Create a new database: `createdb mydatabase`

#### Step 4.2.2: Restore Database

1. Locate the `database` file in the database directory attached to the project
2. Restore the database using pg_restore:
   ```bash
   pg_restore -v -d mydatabase ./database
   ```
3. Verify the restoration completed successfully
4. Create a connection string:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase
   ```

## 5. Authentication Configuration

### Step 5.1: Generate JWT Secrets

1. Generate a secure JWT secret (256+ characters recommended):
   ```bash
   openssl rand -hex 128
   ```
2. Generate AUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```
3. Update your `.env` file:
   ```
   JWT_SECRET=your_generated_jwt_secret
   AUTH_SECRET=your_generated_auth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

## 6. Final Configuration Steps

### Step 6.1: Environment Variables Verification

Ensure all required environment variables are set:

- [ ] RESEND_API_KEY
- [ ] FROM_EMAIL
- [ ] JWT_SECRET
- [ ] AUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] DATABASE_URL (and all related database variables)
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] NEXT_PUBLIC_SERVER_URL
- [ ] NEXT_PUBLIC_APP_URL

### Step 6.2: Database Migration

## Database comes seeded by default
