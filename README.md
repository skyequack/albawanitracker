# Petty Cash Management System

A full-stack web application built with **Next.js (App Router)** for managing petty cash distribution and reconciliation within organizations.

## Overview

This application enables **Project Managers (PMs)** to:
- Issue money to employees for specific projects
- Track expenses and clear transactions
- Generate comprehensive monthly reports
- Manage projects and employees

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Frontend**: React 19, Tailwind CSS 4
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk (to be integrated)
- **TypeScript**: Full type safety

## Features

### 🔐 Authentication & Access Control
- Role-based access (Project Managers only)
- Clerk integration ready
- Restricted access to all features

### 📊 Dashboard
- Monthly petty cash overview
- Quick metrics (Total Issued, Cleared, Pending)
- Recent transactions list
- Quick action buttons

### 📁 Projects
- Create and manage projects
- Organize expenses by project
- View project-specific transactions

### 💰 Transactions
- **Issue Money**: Allocate funds to employees with project assignment
- **Clear Expenses**: Mark transactions as cleared with invoice uploads
- Filter by status (issued, cleared, pending)
- Add notes and clearing notes
- Support for inline employee creation

### 📈 Reports
- Monthly reporting with filters
- Project-wise breakdown (issued, cleared, pending)
- Employee-wise breakdown
- Summary metrics
- Customizable date range filtering

## Project Structure

```
app/
├── (dashboard)/              # Main app routes with sidebar layout
│   ├── dashboard/            # Dashboard page
│   ├── projects/             # Projects management
│   ├── transactions/         # Transactions (issue & clear)
│   └── reports/              # Monthly reports
├── api/
│   ├── projects/             # Projects API endpoints
│   ├── transactions/         # Transactions API endpoints
│   ├── employees/            # Employees API endpoints
│   └── reports/              # Reports API endpoints
├── components/               # Reusable React components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   ├── Sidebar.tsx
│   └── StatCard.tsx
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── auth.ts               # Authentication utilities
│   ├── utils.ts              # Formatting & calculation utilities
│   └── api-client.ts         # API client helpers
├── generated/
│   └── prisma/               # Auto-generated Prisma client
├── layout.tsx                # Root layout with sidebar
├── page.tsx                  # Home redirect to dashboard
└── globals.css               # Global styles
prisma/
├── schema.prisma             # Database schema
└── migrations/               # Database migrations
middleware.ts                 # Auth middleware (Clerk integration point)
.env.example                  # Environment variables template
SETUP.md                       # Detailed setup & integration guide
```

## Database Schema

### User (Project Managers only)
```prisma
- id: String (CUID)
- clerkId: String (nullable, for Clerk integration)
- email: String (unique)
- name: String
- role: String (default: "PM")
- createdAt: DateTime
- updatedAt: DateTime
```

### Employee
```prisma
- id: String (CUID)
- name: String
- employeeId: String (unique, optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Project
```prisma
- id: String (CUID)
- name: String
- description: String (optional)
- createdBy: String (userId, FK)
- createdAt: DateTime
- updatedAt: DateTime
```

### Transaction
```prisma
- id: String (CUID)
- amount: Float
- note: String (optional)
- employeeId: String (FK)
- projectId: String (FK)
- issuedById: String (userId, FK)
- status: String ("issued", "cleared", "pending")
- issuedAt: DateTime
- clearedAt: DateTime (nullable)
- invoiceUrl: String (nullable)
- clearingNote: String (nullable)
- createdAt: DateTime
- updatedAt: DateTime
```

## API Endpoints

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all user projects |
| POST | `/api/projects` | Create new project |
| PATCH | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get user transactions with filters |
| POST | `/api/transactions` | Issue money (create transaction) |
| PATCH | `/api/transactions/[id]` | Clear transaction |
| DELETE | `/api/transactions/[id]` | Delete transaction |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Create new employee |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Generate report with filters |

Query parameters for reports:
- `month`: YYYY-MM format
- `year`: YYYY format
- `projectId`: Filter by project
- `employeeId`: Filter by employee

## Getting Started

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Update DATABASE_URL with your PostgreSQL connection
   ```

3. **Initialize database:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Clerk Integration

See [SETUP.md](./SETUP.md) for detailed Clerk integration steps.

**Quick summary:**
1. Install `@clerk/nextjs`
2. Add Clerk environment variables
3. Update `middleware.ts` with Clerk integration
4. Wrap app with `ClerkProvider` in layout
5. Create webhook to sync users to database

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint

# View database with Prisma Studio
npx prisma studio

# Generate/update Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration_name>

# Reset database (development only)
npx prisma migrate reset
```

## Key Features Deep Dive

### Issue Money Flow
1. PM selects a project
2. PM selects or creates an employee
3. PM enters amount and optional note
4. System creates transaction with "issued" status
5. Amount added to project's issued total

### Clear Transaction Flow
1. PM views transactions with "issued" status
2. PM opens transaction details
3. PM can optionally upload invoice URL
4. PM can add clearing note
5. Transaction status changes to "cleared"
6. Amount moved from pending to cleared

### Report Generation
1. User selects month (or year)
2. System calculates:
   - Total issued this period
   - Total cleared this period
   - Pending balance (issued - cleared)
3. Breakdown by project showing issued/cleared/pending for each
4. Breakdown by employee showing issued/cleared/pending for each

## Security Considerations

- All API routes check for `x-user-id` header (set by middleware)
- Users can only see their own projects and transactions
- PM role is verified for access control
- Environment variables are properly scoped
- Database queries filtered by user ID

## Scalability Features

- Indexed database queries for performance
- Pagination-ready table components
- Modular component architecture
- Reusable API utilities
- Type-safe throughout with TypeScript

## Bonus Features Implemented

- ✅ Inline employee creation in transaction form
- ✅ Invoice URL storage for cleared transactions
- ✅ Clearing notes for audit trail
- ✅ Monthly filtering with date picker
- ✅ Status filtering for transactions
- ✅ Comprehensive dashboard overview
- ✅ Project/Employee breakdown in reports

## Future Enhancements

- [ ] CSV/Excel export for reports
- [ ] Advanced search for employees
- [ ] Pagination for large datasets
- [ ] Audit log for all transactions
- [ ] Email notifications for pending clearances
- [ ] Admin dashboard to manage all users
- [ ] FileUpload integration for invoices (S3/local storage)
- [ ] Multi-currency support
- [ ] Budget limits per project
- [ ] Recurring expenses

## Troubleshooting

See [SETUP.md](./SETUP.md) for common issues and solutions.

## Technology Details

- **Next.js 16.2.4**: Latest App Router features
- **React 19.2.4**: Latest React with improved performance
- **Prisma 7.7.0**: Type-safe ORM with migrations
- **Tailwind CSS 4**: Utility-first styling
- **TypeScript 5**: Full type safety

## License

MIT

## Support

For detailed setup instructions and troubleshooting, see [SETUP.md](./SETUP.md)

For questions about specific technologies:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
