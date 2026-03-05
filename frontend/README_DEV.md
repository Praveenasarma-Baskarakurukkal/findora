# Findora Frontend - Lost and Found Management System

This is the frontend application for the Lost and Found Management System, built for the University of Moratuwa.

## 🎯 Project Overview

A modern React-based web application that allows:
- **Students** to report lost items and search for found items
- **Security Staff** to manage received and released items
- **Administrators** to oversee the entire system

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- npm or yarn package manager

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Update .env.local with your API URL
VITE_API_BASE_URL=http://localhost:8080/api

# 4. Start development server
npm run dev
```

The application will be available at: `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar/          # Top navigation bar
│   ├── Sidebar/         # Left sidebar navigation
│   ├── ItemCard/        # Item display card
│   └── Notification/    # Toast notifications
├── layouts/             # Layout components
│   └── MainLayout/      # Main app layout
├── pages/               # Page components
│   ├── Home/
│   ├── Login/
│   ├── Signup/
│   ├── Student/
│   ├── Security/
│   └── Admin/
├── services/            # API and external services
│   └── api.js          # Centralized API client
├── context/             # React Context
│   └── AuthContext/     # Authentication context
├── hooks/               # Custom React hooks
│   └── useAuth/        # Authentication hook
├── utils/               # Utility functions
│   ├── constants.js    # App constants
│   ├── helpers.js      # Helper functions
│   └── index.js        # Utils export
├── assets/              # Images and static files
├── App.jsx              # Main app component
├── App.css              # Global styles
└── main.jsx             # Entry point
```

## 🔐 Authentication

The app supports role-based authentication:

- **Student Role:** Access to post items, view found items, claim items
- **Security Role:** Receive/release items, manage inventory
- **Admin Role:** System administration, user management, reports

**Test Credentials (Development):**
```
Email: any@email.com
Password: password
Role: student / security / admin
```

## 🛣️ Available Routes

```
/login              - User login
/signup             - User registration
/home               - Home dashboard (protected)
/student            - Student dashboard (protected)
/security           - Security staff dashboard (protected)
/admin              - Admin dashboard (protected)
```

Protected routes require authentication token.

## 🧩 Key Components

### MainLayout
Main wrapper component that includes:
- Navbar (top navigation)
- Sidebar (left navigation)
- Content area

### Navbar
Features:
- Logo and app name
- Search bar
- Notification bell
- User profile dropdown
- Logout button

### Sidebar
Role-based navigation with different menus for each user role.

### ItemCard
Reusable component for displaying lost/found items with claim functionality.

## 🔌 API Integration

All API calls go through the centralized `api.js` service:

```javascript
import api from '@/services/api';

// GET
const items = await api.get('/lost-items');

// POST
const result = await api.post('/lost-items', itemData);

// PUT
await api.put('/lost-items/1', updatedData);

// DELETE
await api.delete('/lost-items/1');
```

## 🎨 Styling

The project uses:
- CSS3 with custom CSS variables
- Component-scoped styles (CSS files co-located with components)
- Responsive design with mobile-first approach

Global CSS variables are defined in `App.css` for consistent theming.

## 📦 Dependencies

- **React** - UI framework
- **React Router DOM** - Client-side routing
- **Vite** - Development server and build tool

## 🧪 Development Mode

```bash
# Start development server with hot reload
npm run dev

# Run linting
npm run lint
```

## 📚 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed project architecture and component guide
- [QUICK_START.md](./QUICK_START.md) - Quick start guide for developers

## 🔮 Future Features

- [ ] Real-time notifications
- [ ] Item images upload
- [ ] Advanced search and filtering
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] PWA support

## 🤝 Contributing

When contributing to this project:

1. Follow the existing code structure
2. Write clear comments (project under development)
3. Use functional components with hooks
4. Keep components modular and reusable
5. Update documentation when adding features

## 🐛 Troubleshooting

**Port 5173 already in use:**
```bash
npm run dev -- --port 3000
```

**Module not found:**
```bash
rm -rf node_modules
npm install
```

**Clear cache and rebuild:**
```bash
npm run build
rm -rf dist
```

## 📞 Support

For issues or questions:
1. Check the ARCHITECTURE.md documentation
2. Review component JSDoc comments
3. Check React Router docs: https://reactrouter.com
4. Check React docs: https://react.dev

## 📝 License

This project is part of the University of Moratuwa Lost and Found Management System.

---

**Status:** Under Active Development ✨

**Tech Stack:** React 19 • Vite • React Router 7 • CSS3
