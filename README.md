# ⚡ FinTrack — Personal Finance Dashboard

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-ffca28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)

**FinTrack** is a modern, high-performance personal finance dashboard crafted with **React, TypeScript, Tailwind CSS, Recharts, and Firebase**. It delivers an intuitive, SaaS-grade experience for tracking income and expenses, monitoring monthly category budgets, achieving long-term financial goals, and exporting comprehensive analytical reports.

Designed with a sleek **near-black graphite dark theme** and vibrant emerald accents, FinTrack offers instant out-of-the-box exploration via a **Demo Mode with LocalStorage persistence**, alongside seamless integration with **Firebase Authentication** and **Cloud Firestore** for cloud synchronization.

---

## 📸 Screenshots

> *Add your platform screenshots below to showcase the dashboard in your portfolio.*

| Dashboard Overview | Transactions & Extrato |
| :---: | :---: |
| ![Dashboard Overview](https://placehold.co/1200x675/0d131a/10b981?text=FinTrack+Dashboard+Overview) | ![Transactions List](https://placehold.co/1200x675/0d131a/10b981?text=Transactions+and+Filters) |

| Budgets & Spending Limits | Financial Goals & Progress |
| :---: | :---: |
| ![Budgets Page](https://placehold.co/1200x675/0d131a/10b981?text=Monthly+Budgets+Ceilings) | ![Goals Page](https://placehold.co/1200x675/0d131a/10b981?text=Financial+Goals+and+Milestones) |

---

## ✨ Features

### 📊 1. Overview Dashboard
- **Real-Time KPIs**: Total net balance, period income, expenses, and net savings rate.
- **Period-over-Period Comparison**: Automated percentage variation vs. previous period (`+12.4%`, `-3.8%`).
- **Income vs. Expenses Evolution Chart**: Responsive 6-month historical bar chart built with Recharts.
- **Category Expenses Donut Chart**: Interactive breakdown of expenditures by category.
- **Budget Alerts**: Automatic warnings when category consumption reaches or exceeds 80% and 100%.
- **Goals Progress Snippet**: High-level tracking of active financial milestones.
- **Global Period Filtering**: Filter all dashboard data by *This Month*, *Last Month*, *Last 3 Months*, *Last 6 Months*, *This Year*, or *All Time*.

### 💸 2. Transactions Management
- **Full CRUD**: Add, view, edit, and delete income and expense records.
- **Search & Filter**: Search by title or description; filter by category and transaction type.
- **Sorting & Pagination**: Sort by date (newest/oldest) or amount (highest/lowest) with fluid pagination.
- **Form Validation**: Strict validation preventing empty titles, negative values, or zero amounts.
- **Reactive Recalculations**: Balances, charts, and budget statuses update instantly upon any record mutation.

### 🛡️ 3. Category Budgets & Spending Limits
- **Monthly Spending Limits**: Set expense ceilings per category (e.g., Housing, Food, Transportation).
- **Progress Tracking**: Real-time progress bars showing spent amount, remaining margin, and percentage used.
- **Dynamic Visual Alerts**: Safe (green), Warning (amber at 80%), and Danger (rose at 100%+) status badges.

### 🎯 4. Financial Goals & Milestones
- **Custom Goals**: Define target amounts, deadlines, categories, and identification colors.
- **Deposit Registrations**: Easily contribute funds towards any goal with one click.
- **Automatic Expense Linking**: Optional automatic creation of an expense transaction when making deposits.
- **Celebration Effect**: Smooth confetti animation triggered when an objective reaches 100%.

### 📈 5. Reports & Analytics
- **Accounting Breakdown**: In-depth table detailing total spent, category share, transaction count, and average ticket size.
- **Month-over-Month Direct Comparison**: Side-by-side analysis between any two historical months.
- **CSV Data Export**: Instant download of sanitized transactions in CSV format with UTF-8 BOM encoding for seamless Microsoft Excel and Google Sheets compatibility.

### ⚙️ 6. Profile & Settings
- **User Profile**: Customize display name and choose between Brazilian Real (`R$ BRL`), US Dollar (`$ USD`), and Euro (`€ EUR`).
- **Theme Switcher**: Seamless toggle between Dark graphite mode and Light mode.
- **Cloud & Demo Indicator**: Transparent connection status card with guidance on configuring Firebase.
- **Data Reset**: Reset to the default Brazilian benchmark dataset at any time.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with custom design system tokens
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Micro-Interactions**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend & Auth**: [Firebase v13](https://firebase.google.com/) (Authentication & Cloud Firestore)
- **Fallback Persistence**: Browser `LocalStorage` for Demo Mode

---

## 📂 Project Architecture

```
fintrack/
├── public/                 # Static public assets and favicon
├── src/
│   ├── components/
│   │   ├── auth/           # ProtectedRoute and authentication guards
│   │   ├── budgets/        # BudgetCard, BudgetModal
│   │   ├── dashboard/      # MetricCard, IncomeExpenseChart, CategoryPieChart, RecentTransactionsList, GoalsOverview, BudgetAlerts
│   │   ├── goals/          # GoalCard, GoalModal, ContributeModal
│   │   ├── layout/         # Sidebar, Header, Layout shell, Mobile navigation
│   │   ├── reports/        # CategoryReportTable, MonthlyComparison
│   │   ├── transactions/   # TransactionTable, TransactionFilters, TransactionModal
│   │   └── ui/             # Reusable design system: Button, Card, Badge, Input, Select, Modal, ProgressBar, ConfirmDialog, EmptyState
│   ├── contexts/
│   │   ├── AuthContext.tsx    # Firebase authentication & Demo mode state
│   │   ├── FinanceContext.tsx # Centralized business logic, transactions, budgets, goals
│   │   ├── ThemeContext.tsx   # Dark / Light theme manager
│   │   └── ToastContext.tsx   # Toast notification provider
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   ├── BudgetsPage.tsx
│   │   ├── GoalsPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/
│   │   ├── firebase.ts        # Firebase client initialization & env verification
│   │   ├── mockData.ts        # Realistic seed data (BRL currency, Portuguese categories)
│   │   └── storageService.ts  # Abstraction repository (Firestore ↔ LocalStorage)
│   ├── types/
│   │   └── index.ts           # Unified TypeScript interfaces
│   ├── utils/
│   │   ├── calculations.ts    # Financial metrics, summaries, and monthly aggregates
│   │   ├── categories.ts      # Categories list, icons, and color assignments
│   │   ├── cn.ts              # Tailwind class merger (clsx + tailwind-merge)
│   │   ├── csvExport.ts       # UTF-8 BOM CSV spreadsheet exporter
│   │   └── formatters.ts      # BRL currency (pt-BR), dates (DD/MM/YYYY), percentages
│   ├── App.tsx                # Route definitions and provider composition
│   ├── index.css              # Tailwind base, dark graphite variables, custom scrollbars
│   └── main.tsx               # Entry point
├── .env.example               # Example environment variables
├── firestore.rules            # Firestore security rules
├── tailwind.config.js         # Custom theme configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/fintrack.git
cd fintrack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally (Demo Mode)
You can run FinTrack immediately without any external accounts! If no Firebase keys are detected, the app automatically runs in **Demo Mode** using realistic pre-loaded Brazilian financial data stored in `localStorage`.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Firebase Configuration (Optional)

To enable cloud persistence and real multi-user authentication:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Under **Build > Authentication**, enable the **Email/Password** sign-in method.
3. Under **Build > Firestore Database**, create a database in production mode.
4. Go to **Project Settings > General > Your Apps**, create a Web App, and copy the configuration keys.
5. In your local project root, duplicate `.env.example` into a new `.env` file:

```bash
cp .env.example .env
```

6. Fill in your Firebase credentials in `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
```

7. Deploy the security rules provided in [firestore.rules](firestore.rules) to your Firebase project.

8. Restart your dev server:
```bash
npm run dev
```

---

## 🔒 Firestore Security Rules

FinTrack guarantees strict per-user data isolation. Users can only query and mutate their own financial records. Deploy the contents of `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /transactions/{transactionId} {
        allow read, write: if isOwner(userId);
      }
      match /budgets/{budgetId} {
        allow read, write: if isOwner(userId);
      }
      match /goals/{goalId} {
        allow read, write: if isOwner(userId);
      }
      match /profile/{docId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

---

## 📦 Available Scripts

In the project root, you can run:

- `npm run dev`: Starts the local development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles TypeScript with `tsc` and generates the production bundle using Vite.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs code quality checks.

---

## 🌐 Production Deployment

FinTrack is a single-page application (SPA) and can be deployed in minutes on any modern hosting platform:

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Under Environment Variables, add your `VITE_FIREBASE_*` keys (if using Firebase).
4. Click **Deploy**.

### Deploy to Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. Set Build command to `npm run build` and Publish directory to `dist`.
3. Add a `_redirects` file with `/*  /index.html  200` to support client-side routing.
4. Deploy site.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use it for learning, customization, or as part of your developer portfolio.
