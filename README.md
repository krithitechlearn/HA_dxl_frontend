# Home Automation DXL Frontend

React 18 + TypeScript single-page application for the Home Automation Device Experience Layer (DXL) platform.

## Tech Stack

- **React 18** with TypeScript (strict mode)
- **Vite** for build tooling
- **React Router v6** for routing
- **Axios** for HTTP requests
- **React Hook Form + Zod** for forms and validation
- **Zustand** for global state management
- **Recharts** for telemetry visualization
- **Jest + React Testing Library** for testing

## Prerequisites

- Node.js 18+ and npm 9+
- Backend API running on `http://localhost:8080` (or configure `VITE_API_BASE_URL`)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

### Testing

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

```
src/
  features/          # Feature modules (auth, users, devices, etc.)
  components/        # Shared UI components
  routes/            # Routing configuration
  services/          # API client and service layer
  store/             # Zustand global stores
  hooks/             # Custom React hooks
  types/             # TypeScript type definitions
  utils/             # Utility functions
  styles/            # Global styles
```

## Key Features

- **Role-based access control** (ADMIN, USER, GUEST)
- **Device management** with real-time status
- **Device command issuance** with validation
- **Telemetry visualization** with time-series charts
- **Automation rules** with trigger and action configuration
- **Audit log viewing** (ADMIN only)
- **Responsive design** with mobile support
- **Accessibility** compliant with WCAG 2.1 AA

## Authentication

- JWT tokens stored in HttpOnly cookies
- Automatic token refresh on 401 responses
- Secure logout with cookie clearing

## Browser Support

- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

## License

Proprietary - All rights reserved