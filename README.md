# ShuttleCash Frontend

Badminton club management system frontend built with React, TypeScript, and Vite.

## Features

- User authentication
- Member management
- Shuttlecock usage tracking
- Financial records (income/expense)
- Real-time dashboard
- Responsive design

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration:**
   The `.env` file is already configured with default values:

   ```env
   VITE_API_BASE_URL=http://localhost:3002/api
   VITE_APP_NAME=ShuttleCash
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=development
   ```

   **Note:** If your backend runs on a different port, update `VITE_API_BASE_URL` accordingly.

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Backend Integration

This frontend connects to the ShuttleCash backend API. Make sure the backend is running:

```bash
# In the shuttlecash-be directory
cd ../shuttlecash-be
npm install
npm run db:init  # Initialize database
npm run db:seed  # Populate with dummy data (optional)
npm run dev      # Start backend server on port 3002
```

## Default Login

- **Username**: admin
- **Password**: admin123

## Environment Variables

| Variable            | Description          | Default                     |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3002/api` |
| `VITE_APP_NAME`     | Application name     | `ShuttleCash`               |
| `VITE_APP_VERSION`  | Application version  | `1.0.0`                     |
| `VITE_NODE_ENV`     | Environment mode     | `development`               |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
