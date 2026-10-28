# FinTrack — Personal Finance Dashboard

A modern personal finance management application designed to help users track income, expenses, budgets, and financial goals through a clean and intuitive dashboard.

## Overview

FinTrack is a web application focused on simplifying personal financial management. It provides a centralized dashboard where users can monitor their financial activity, analyze spending habits, and track their progress toward financial goals.

## Features

- **Financial Dashboard** — Overview of balance, income, expenses, and savings.
- **Transaction Management** — Create, edit, delete, search, and filter financial transactions.
- **Budget Tracking** — Set monthly spending limits and monitor expenses by category.
- **Financial Goals** — Create savings goals and track progress toward each target.
- **Reports & Analytics** — Visualize financial data through interactive charts.
- **Data Export** — Export transaction records to CSV.
- **Authentication** — Secure user registration and login.
- **Responsive Design** — Interface adapted to desktop, tablet, and mobile devices.
- **Dark & Light Mode** — Choose the theme that suits your preferences.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- React Router
- Firebase Authentication
- Cloud Firestore

## Getting Started

### Prerequisites

- Node.js
- npm
- A Firebase project for authentication and cloud data storage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/guiwpedroso/fintrack.git
   ```

2. Navigate to the project directory:

   ```bash
   cd fintrack
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Configure your environment variables using the `.env.example` file provided in the project.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in your terminal.

## Environment Variables

Firebase configuration may require environment variables such as:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Configure these values using your own Firebase project. Never commit private credentials or secret files to the repository.

## Project Structure

```text
fintrack/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── main.tsx
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

*The actual structure may vary depending on the implementation.*

## Screenshots

Screenshots of the application will be added here.

## Roadmap

- [ ] Financial dashboard
- [ ] Transaction management
- [ ] Budget management
- [ ] Financial goals
- [ ] Reports and analytics
- [ ] Firebase authentication and data persistence
- [ ] Responsive design
- [ ] Production deployment

## Purpose

This project was created as part of my software development portfolio to practice modern web development, reusable components, data management, and application architecture.

## License

This project is open source and available under the MIT License. Add a `LICENSE` file to the repository to include the license terms.

---

Developed by [Guilherme Pedroso](https://github.com/guiwpedroso). 