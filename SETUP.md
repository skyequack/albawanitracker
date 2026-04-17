# Petty Cash Management System - Setup Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Prisma PostgreSQL already configured)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and update with your actual values:

```bash
cp .env.example .env.local
```

Update the `DATABASE_URL` with your PostgreSQL connection string.

### 3. Run Prisma Migrations

```bash
npx prisma migrate deploy
```

Or generate Prisma Client:

```bash
npx prisma generate
```

### 4. Integrate Clerk Authentication

This application is configured for Clerk integration. Follow these steps:

#### Step 1: Create a Clerk Account
- Go to https://clerk.com and sign up
- Create a new application

#### Step 2: Install Clerk Package

```bash
npm install @clerk/nextjs
```

#### Step 3: Add Clerk Environment Variables

Update `.env.local` with your Clerk keys:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

#### Step 4: Update Middleware

Edit `middleware.ts` and uncomment the Clerk integration code:

```typescript
import { clerkMiddleware, auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    // Allow public routes here if needed
    return auth().redirectToSignIn();
  }

  // Add userId to request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", userId);
  
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

#### Step 5: Update Layout

Update `app/layout.tsx` to include Clerk provider:

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <div className="flex h-screen">
            {/* Your layout here */}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

#### Step 6: Create a User in Database

When a user signs in with Clerk, you'll need to sync their data to Prisma. Create a webhook or use Clerk's user management to create a `User` record:

```typescript
// Example endpoint to sync user
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: "user@example.com", // Get from Clerk user object
      name: "User Name",
      role: "PM",
    },
  });

  return Response.json(user);
}
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### Dashboard
- Overview of monthly petty cash metrics
- Quick access to main features
- Recent transactions

### Projects
- Create and manage projects
- Each PM can only see their own projects
- Use projects to organize expenses

### Transactions
- **Issue Money**: Allocate funds to employees for specific projects
- **Clear Expenses**: Mark transactions as cleared and upload invoices
- Filter by status (issued, cleared, pending)

### Reports
- Monthly reports with filtering options
- Project-wise breakdown of issued and cleared amounts
- Employee-wise breakdown of transactions
- Summary metrics (total issued, cleared, pending)

## API Endpoints

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create a new project
- `PATCH /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project

### Transactions
- `GET /api/transactions?status=...&projectId=...` - Get transactions with filters
- `POST /api/transactions` - Issue money (create transaction)
- `PATCH /api/transactions/[id]` - Clear a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create a new employee

### Reports
- `GET /api/reports?month=YYYY-MM&projectId=...` - Generate monthly report

## Authentication Notes

- Currently, the system uses `x-user-id` header in requests
- This will be replaced with Clerk's userId once integrated
- API routes check for `x-user-id` header and return 401 Unauthorized if missing
- Only Project Managers (PMs) can access the application

## Development

### View Database
```bash
npx prisma studio
```

This opens a visual UI to manage your database.

### Create a New Migration
```bash
npx prisma migrate dev --name <migration_name>
```

## Troubleshooting

### "Unauthorized" Error
- Make sure Clerk is properly integrated
- Check that `x-user-id` header is being set in middleware
- Verify that the user record exists in the database

### Database Connection Error
- Check your `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify database credentials

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (development only!)
npx prisma migrate reset
```

## Next Steps

1. Set up Clerk authentication following the steps above
2. Create test projects and employees
3. Try issuing money and clearing transactions
4. Review reports to verify calculations

## Support

For issues with:
- **Clerk**: https://clerk.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Next.js**: https://nextjs.org/docs
