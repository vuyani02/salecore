# 📊 Salecore

## What is Salecore?

Salecore is a modern, enterprise-grade Sales Automation web application built for Boxfusion — a B2B enterprise software solutions company. It provides a professional interface for sales teams to manage their full sales lifecycle, from tracking opportunities and sending proposals to monitoring contracts and logging client activities.

Salecore focuses on pipeline visibility, operational efficiency, and structured sales workflows while demonstrating real-world application architecture, provider-based state management, and role-based access control using modern web technologies.

---

## 🌐 Live Demo

🔗 **Salecore Demo:** https://salecore.vercel.app/

---

## 📄 Pages

Salecore includes the following pages:

| Page | Description |
|------|-------------|
| **Login Page** | Authenticate with your account |
|**Signup Page** | create an account |
| **Dashboard Page** | Pipeline, revenue, activities and leaderboard overview |
| **Opportunities Page** | Create and manage sales opportunities |
| **Clients Page** | View and manage client accounts |
| **Proposals Page** | Build, submit, approve and reject proposals |
---

## 🧩 Components & Functional Requirements

### 1. Authentication Subsystem
- User can log in with email and password
- JWT token is stored in LocalStorage per session
- User role is stored and tracked per session
- User can log out
- Role-based access control: Admin, SalesManager, SalesRep

### 2. Dashboard Subsystem
- View pipeline value, win rate, total contract value, and active contract count
- Revenue trend chart with this month, quarter, and year totals
- Pipeline stages breakdown by opportunity count
- Activities summary — upcoming, overdue, and completed today
- Opportunities summary — total count and deals won
- Top 5 sales reps leaderboard

### 3. Opportunities Subsystem
- View all opportunities with stage filter and search
- View personal opportunities via My Opportunities tab
- Create new opportunities with client, contact, stage, value, source, and probability
- Delete opportunities — Admin / SalesManager only
- Paginated results

### 4. Clients Subsystem
- View and search all clients
- Filter clients by industry
- Create new clients with name, industry, type, website, billing address, tax number, and company size
- Delete clients — Admin / SalesManager only
- Paginated results

### 5. Proposals Subsystem
- View all proposals with status filter
- Create proposals with line items and automatic total calculation
- Line item formula: `(Quantity × UnitPrice × (1 − Discount/100)) × (1 + TaxRate/100)`
- View full proposal detail with line items and totals in a side drawer
- Submit proposals for approval
- Approve proposals — Admin / SalesManager only
- Reject proposals with a reason — Admin / SalesManager only
- Delete draft proposals — Admin / SalesManager only

### 6. Contracts Subsystem
- View all contracts with status filter
- Monitor contracts expiring this month
- Create and activate contracts linked to opportunities
- Cancel contracts — Admin / SalesManager only
- Manage contract renewals

### 7. Activities Subsystem
- View all activities — meetings, calls, emails, tasks
- See upcoming and overdue activities
- Create activities linked to clients, opportunities, or contacts
- Mark activities as complete with outcome notes
- Cancel activities

### 8. Reports Subsystem
- Opportunities report by date range and stage
- Sales by period grouped by month or week
- Sales performance leaderboard across reps
- Accessible by Admin / SalesManager only

### 9. State Management Subsystem
- Provider-based state management using redux-actions pattern
- Each domain has its own context, actions, reducer, and provider
- All API calls dispatch pending, success, and error actions
- Providers wrap their respective page layouts

### 10. UI / UX Subsystem
- Dark theme with consistent design across all pages
- Responsive layout for all screen sizes
- Ant Design component library with antd-style CSS-in-JS
- Role-based UI — buttons and actions shown based on user role
- Paginated tables with search and filter controls
- Side drawers for detailed views

---

## ⚙️ How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/salecore.git

# 2. Navigate to the project folder
cd salecore

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

> The app will be running at **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@salesautomation.com | Admin@123 |

---

## 🧪 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Ant Design** | UI component library |
| **antd-style** | CSS-in-JS styling with `createStyles` |
| **Recharts** | Revenue and pipeline charts |
| **Axios** | HTTP client for API calls |
| **redux-actions** | Provider-based state management |
| **Day.js** | Date formatting and manipulation |
| **LocalStorage API** | Session and token persistence |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── login/page.tsx              # Login page
│   ├── dashboard/page.tsx          # Dashboard page
│   ├── opportunities/
│   │   ├── layout.tsx              # OpportunitiesProvider wrapper
│   │   └── page.tsx                # Opportunities page
│   ├── clients/
│   │   ├── layout.tsx              # ClientsProvider wrapper
│   │   └── page.tsx                # Clients page
│   ├── proposals/
│       ├── layout.tsx              # ProposalsProvider wrapper
│       └── page.tsx                # Proposals page
│  
├── providers/
│   ├── opportunitiesProvider/      # context, actions, reducer, index
│   ├── clientsProvider/            # context, actions, reducer, index
│   ├── contactsProvider/           # context, actions, reducer, index
│   └── proposalsProvider/          # context, actions, reducer, index
├── components/
│   ├── navbar/                     # Top navigation bar
│   ├── statcard/                   # KPI stat cards
│   ├── pipelinecard/               # Pipeline stages bar
│   ├── revenuecard/                # Revenue trend chart
│   ├── activitycard/               # Activities summary card
│   ├── opportunitiescard/          # Opportunities summary card
│   └── topsalesrepscard/           # Leaderboard card
├── types/                          # TypeScript interfaces
└── util/
    └── axiosInstance.ts            # Axios instance with auth headers
```

---

## 🔌 API

Salecore consumes a deployed REST API hosted on Azure:

```
https://sales-automation-bmdqg9b6a0d3ffem.southafricanorth-01.azurewebsites.net
```

All endpoints except login require a Bearer token:
```
Authorization: Bearer <token>
```

---

## 👨‍💻 Developer

| | |
|--|--|
| **Project Name** | Salecore |
| **Client** | Boxfusion |
| **Developer** | Vuyani Matshungwana |
| **Type** | Enterprise Web Application |
| **Purpose** | learning Project — Sales Automation System |

---

## 📄 License

This project was developed as a learningt project. All rights reserved.