# Findora Frontend - React Project Structure

A modern, scalable Lost and Found Management System frontend built with React, React Router, and a component-based architecture.

## 📂 Folder Structure

```
src/
 ├── components/              # Reusable components
 │   ├── Navbar/
 │   │   ├── Navbar.jsx      # Top navigation with search, notifications, profile
 │   │   └── Navbar.css
 │   ├── Sidebar/
 │   │   ├── Sidebar.jsx     # Left sidebar with role-based navigation
 │   │   └── Sidebar.css
 │   ├── ItemCard/
 │   │   ├── ItemCard.jsx    # Reusable card for displaying lost/found items
 │   │   └── ItemCard.css
 │   └── Notification/
 │       ├── Notification.jsx # Toast notifications component
 │       └── Notification.css
 │
 ├── layouts/                 # Layout components
 │   ├── MainLayout.jsx       # Main layout with navbar + sidebar
 │   └── MainLayout.css
 │
 ├── pages/                   # Page/route components
 │   ├── Home/
 │   │   └── Home.jsx         # Dashboard home page
 │   ├── Login/
 │   │   ├── Login.jsx        # User login page
 │   │   └── Login.css
 │   ├── Signup/
 │   │   ├── Signup.jsx       # User registration page
 │   │   └── Signup.css
 │   ├── Student/
 │   │   └── Student.jsx      # Student dashboard
 │   ├── Security/
 │   │   └── Security.jsx     # Security staff dashboard
 │   └── Admin/
 │       └── Admin.jsx        # Administrator dashboard
 │
 ├── services/                # API and external services
 │   └── api.js              # Centralized API client
 │
 ├── context/                 # React Context for global state
 │   └── AuthContext.jsx      # Authentication context
 │
 ├── hooks/                   # Custom React hooks
 │   └── useAuth.js          # Custom hook for auth context
 │
 ├── utils/                   # Utility functions (future)
 │
 ├── assets/                  # Images, icons, fonts
 │
 ├── App.jsx                  # Main app component with routing
 ├── App.css                  # Global styles
 ├── main.jsx                 # Entry point
 └── index.css               # Global CSS reset
```

## 🎯 Key Components

### 1. **MainLayout** (`layouts/MainLayout.jsx`)
Main wrapper component for authenticated pages. Includes navbar + sidebar + content area.

```jsx
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';

// Usage in App.jsx
<MainLayout>
  <Home />
</MainLayout>
```

### 2. **Navbar** (`components/Navbar/Navbar.jsx`)
Top navigation bar with:
- Logo/App name
- Search bar
- Notification icon with badge
- User profile dropdown
- Logout button

### 3. **Sidebar** (`components/Sidebar/Sidebar.jsx`)
Left navigation sidebar with role-based menu items.

**Navigation by Role:**
- **Student**: Home, Post, Lost, Found, Profile, Settings, Logout
- **Security**: Home, Receive, Release, History, Post, Profile, Settings, Logout
- **Admin**: Home, Lost Reports, Found Reports, Receive, Release, Users, Security Requests, Admin Requests, Settings, Logout

### 4. **ItemCard** (`components/ItemCard/ItemCard.jsx`)
Reusable card component for displaying lost/found items.

```jsx
<ItemCard 
  item={{ 
    id: 1, 
    name: 'Student ID Card', 
    description: 'Blue ID card',
    location: 'Library',
    date: 'Feb 5, 2026'
  }} 
  cardType="found"
  onClaim={(itemId) => console.log('Claimed:', itemId)}
/>
```

### 5. **AuthContext** (`context/AuthContext.jsx`)
Global authentication state management. Provides:
- User information
- Authentication status
- User role
- Login/logout functions

```jsx
import { AuthContext } from './context/AuthContext';

const { user, isAuthenticated, userRole, login, logout } = useContext(AuthContext);
```

## 🔗 Routing

All routes are configured in `App.jsx`:

```
/login     → Login page (no layout)
/signup    → Signup page (no layout)
/home      → Home dashboard (with MainLayout)
/student   → Student page (with MainLayout)
/security  → Security page (with MainLayout)
/admin     → Admin page (with MainLayout)
```

**Protected Routes:** All pages except `/login` and `/signup` require authentication token.

## 🎨 Global Styles

Global CSS variables are defined in `App.css`:

```css
:root {
  --primary-color: #667eea;
  --danger-color: #e74c3c;
  --success-color: #27ae60;
  --spacing-md: 16px;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
}
```

Use these throughout components for consistent styling.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm build
```

## 📡 API Integration

The `api.js` service handles all HTTP requests to the backend:

```jsx
import api from './services/api';

// GET request
const data = await api.get('/lost-items');

// POST request
const response = await api.post('/lost-items', { name: 'Item' });

// PUT request
await api.put('/lost-items/1', { status: 'claimed' });

// DELETE request
await api.delete('/lost-items/1');
```

**Base URL:** Set via `VITE_API_BASE_URL` environment variable (default: `http://localhost:8080/api`)

## 🔐 Authentication

Authentication is managed via:
1. **AuthContext** - Global state
2. **localStorage** - Token storage
3. **ProtectedRoute** - Route protection

Login flow:
1. User submits credentials on `/login`
2. Token and role saved to localStorage
3. User redirected to `/home`
4. Protected routes validate token before rendering

## 💾 localStorage Keys

- `authToken` - JWT or session token
- `userRole` - User role (student, security, admin)
- `userEmail` - User email address

## 🪝 Custom Hooks

### useAuth Hook
Easy access to authentication context:

```jsx
import useAuth from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

## 📋 Future Development Tasks

- [ ] Create Profile page
- [ ] Create Settings page
- [ ] Create Lost Items page
- [ ] Create Found Items page
- [ ] Create Post Item page
- [ ] Implement actual API calls
- [ ] Add error pages (404, 500)
- [ ] Add loading skeletons
- [ ] Add form validation
- [ ] Add search functionality
- [ ] Add filtering/sorting
- [ ] Add pagination
- [ ] Add dark mode
- [ ] Add internationalization (i18n)
- [ ] Add unit tests
- [ ] Add E2E tests

## 🛠️ Development Tips

1. **Component Reusability:** Keep components small and focused
2. **Props Validation:** Use PropTypes or TypeScript
3. **State Management:** Use Context for global state, useState for local
4. **Styling:** Use CSS files co-located with components
5. **Comments:** Write clear comments in code (project under development)
6. **Environment Variables:** Define in `.env` file

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 👨‍💻 Contributing

When adding new features:
1. Create new folder in appropriate section
2. Export components from index.js
3. Add clear comments
4. Update this README
5. Test before committing

---

**Project:** Lost and Found Management System for University of Moratuwa
**Tech Stack:** React, React Router, Vite, CSS3
**Status:** Under Development ✨
