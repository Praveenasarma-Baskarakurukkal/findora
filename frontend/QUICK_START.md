# React Project Setup - Quick Start Guide

## Prerequisites
- Node.js (v16+)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- react: ^19.2.0
- react-dom: ^19.2.0
- react-router-dom: ^7.0.0

### 2. Setup Environment Variables
Copy `.env.example` to `.env.local` and update values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

Output will be in `dist/` folder.

### 5. Preview Production Build
```bash
npm run preview
```

## Project Features

✅ **Scalable Folder Structure**
- Organized by feature: components, pages, services, context, hooks, layouts

✅ **Reusable Components**
- MainLayout, Navbar, Sidebar, ItemCard, Notification components
- Component styles co-located with JSX files

✅ **React Router Integration**
- Client-side routing
- Protected routes with authentication
- Role-based navigation

✅ **Authentication Context**
- Global auth state management
- Custom useAuth hook for easy access
- Token-based authentication flow

✅ **API Client Service**
- Centralized API requests
- Automatic token injection
- Error handling and response parsing

✅ **Role-Based Navigation**
- Student sidebar menu
- Security staff sidebar menu
- Admin sidebar menu

✅ **Responsive Design**
- Mobile-friendly layouts
- Adjustable sidebar
- Mobile-optimized navbar and forms

## Folder Structure Overview

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── services/        # API and external services
│   ├── context/         # Global state (Auth, etc)
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── assets/          # Images and static files
│   ├── App.jsx          # Main app with routing
│   ├── App.css          # Global styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Reset styles
├── package.json
├── vite.config.js
├── ARCHITECTURE.md      # Detailed documentation
└── QUICK_START.md       # This file
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server on http://localhost:5173

# Build
npm run build        # Build for production (creates dist/)
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Key Files to Know

- **App.jsx** - Main app component, sets up routing
- **layouts/MainLayout.jsx** - Layout wrapper for authenticated pages
- **components/Navbar/Navbar.jsx** - Top navigation bar
- **components/Sidebar/Sidebar.jsx** - Left sidebar with role-based menu
- **context/AuthContext.jsx** - Global authentication state
- **services/api.js** - Centralized API client

## Authentication Flow

1. User visits `/login`
2. Enters credentials and role
3. Credentials validated (mock for now)
4. Token and role stored in localStorage
5. Redirected to `/home`
6. Protected pages check token before rendering
7. Logout clears storage and redirects to `/login`

**Test Credentials (Development):**
- Email: any@email.com
- Password: password
- Role: student/security/admin

## Login Routes

- `/login` - User login page
- `/signup` - User registration page
- `/home` - Home dashboard
- `/student` - Student-specific page
- `/security` - Security staff page
- `/admin` - Admin page

All routes except `/login` and `/signup` require authentication.

## Sidebar Navigation by Role

### Student Dashboard
- Home
- Post Item
- Lost Items
- Found Items
- My Profile
- Settings
- Logout

### Security Staff Dashboard
- Home
- Receive Item
- Release Item
- History
- Post Update
- My Profile
- Settings
- Logout

### Admin Dashboard
- Home
- Lost Reports
- Found Reports
- Receive Item
- Release Item
- Manage Users
- Security Requests
- Admin Requests
- Settings
- Logout

## Code Style Guidelines

- Use functional components with React hooks
- Write clear comments (project under development)
- Keep components modular and reusable
- Co-locate styles with components
- Use meaningful variable and function names
- Follow the existing folder structure

## Troubleshooting

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
```

**Module not found errors:**
```bash
rm -rf node_modules
npm install
```

**Clear development cache:**
```bash
npm run build
rm -rf dist
```

## Next Steps

After setup, check the following to extend the project:

1. **Connect Backend API** - Update `services/api.js` and implement actual API calls
2. **Create Additional Pages** - Add Profile, Settings, Lost Items, Found Items pages
3. **Add Form Validation** - Implement form validation in Login/Signup
4. **Add Loading States** - Use loading skeletons and spinners
5. **Implement Search** - Add search functionality to Navbar
6. **Add Error Pages** - Create 404 and 500 error pages
7. **Write Tests** - Add unit and E2E tests
8. **Setup Deployment** - Deploy to production

## Support

For issues or questions:
1. Check the ARCHITECTURE.md file
2. Review component documentation in JSDoc comments
3. Check React Router documentation: https://reactrouter.com
4. Check React documentation: https://react.dev

---

**Happy Coding! 🚀**

Project: Lost and Found Management System for University of Moratuwa
