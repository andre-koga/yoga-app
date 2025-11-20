# ![Supanext](.github/supanext.png)

# SupaNext - Next.js + Supabase PWA Starter Template

A production-ready starter template for building modern web applications with PWA capabilities, authentication, and a monorepo structure.

## Features

- **Progressive Web App (PWA)**: Installable on mobile and desktop, offline support, and app-like experience
- **Monorepo Structure**: Separate frontend (Next.js) and backend (Supabase) for clean architecture
- **Authentication**: Secure user authentication with email/OTP verification via Supabase Auth
- **Modern Stack**: Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Shadcn UI
- **Local Development**: Full Supabase local environment with Docker

## Project Structure

```
nextjs-pwa-starter/
├── frontend/          # Next.js 16 application
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   └── public/       # Static assets & PWA manifest
├── backend/           # Supabase local development
│   ├── supabase/     # Migrations, functions, config
│   └── scripts/      # Utility scripts (e.g., smart-start)
└── package.json       # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for local Supabase)
- Supabase CLI (`pnpm install -g supabase`)

### Installation

1. Clone or fork this repository:
   ```bash
   git clone <repository-url>
   cd nextjs-pwa-starter
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment files:
   ```bash
   cp frontend/.env.example frontend/.env.local
   cp backend/.env.example backend/.env.local
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```
   This command will automatically:
   - Start the local Supabase instance (handling port conflicts automatically)
   - Start the Next.js frontend
   - Open the app at [http://localhost:3000](http://localhost:3000)

5. Update `frontend/.env.local` with your Supabase credentials (printed in console after `supabase start`)

### Development Commands

- `pnpm dev`: Start both frontend and backend
- `pnpm dev:frontend`: Start only the Next.js frontend
- `pnpm dev:backend`: Start only the Supabase backend
- `pnpm build`: Build the frontend for production
- `pnpm lint`: Run ESLint
- `pnpm typecheck`: Run TypeScript type checking
- `pnpm supabase:start`: Start Supabase services
- `pnpm supabase:stop`: Stop Supabase services
- `pnpm supabase:status`: Check Supabase status

## PWA Features

The app is fully PWA compatible with:
- Service worker for offline functionality
- Web app manifest for installation
- Caching strategies for optimal performance
- Offline fallback page

Verify in Chrome DevTools → Application tab → Manifest & Service Workers

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Package Manager**: pnpm (Workspace mode)
- **DevOps**: Docker for local Supabase

## What's Included

### Authentication Flow
- Email/password signup with OTP verification
- Beautiful OTP input component (Shadcn UI)
- Email confirmation via local Mailpit server
- Protected routes with middleware
- Session management

### Developer Experience
- TypeScript strict mode
- ESLint with Next.js config
- Auto-fixing lint errors
- Type checking
- Hot reload for both frontend and backend
- Smart Supabase startup (handles port conflicts)

### Production Ready
- Environment variable validation
- Proper error handling
- SEO optimized
- Responsive design
- Accessibility best practices

## Customization

This is a starter template - customize it for your needs:

1. **Update branding**: Change app name in `frontend/public/manifest.json`
2. **Add features**: Build on the authentication foundation
3. **Database schema**: Create migrations in `backend/supabase/migrations/`
4. **Styling**: Customize Tailwind config or add Shadcn components
5. **Deploy**: Follow deployment guides in `AGENTS.md`

## Documentation

- **AGENTS.md**: Comprehensive guide for AI agents and developers
- **README.md**: This file - getting started guide
- `.env.example` files: Environment variable templates

## License

MIT License - feel free to use this template for your projects!

## Contributing

This is a starter template. Fork it and make it your own!

---

**Built with ❤️ using Next.js, Supabase, and modern web technologies**
