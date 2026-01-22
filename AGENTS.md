# AGENTS.md

This document contains guidelines and commands for agentic coding agents working in the read-vagabond repository.

## Project Overview

This is a manga reader application built with Astro, deployed on Cloudflare Workers. It serves Takehiko Inoue's Vagabond manga with a minimalist, high-quality reading experience. The application uses D1 database for metadata and R2 for image storage.

## Build & Development Commands

### Core Commands
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Astro CLI
pnpm astro <command>  # Run any Astro CLI command

# Cloudflare deployment
wrangler deploy       # Deploy to Cloudflare Workers
wrangler dev          # Local development with Workers runtime
```

### Testing
No dedicated test framework is currently configured. Manual testing should be performed by:
1. Running `pnpm dev` and testing all user flows
2. Testing API endpoints directly
3. Verifying responsive design across devices
4. Testing Cloudflare deployment with `wrangler dev`

### Database Operations
```bash
# Run migrations (if needed)
wrangler d1 execute vagabond-db --file=./migrations/0001_init.sql
wrangler d1 execute vagabond-db --file=./migrations/0002_seed_chapters.sql
# etc.
```

## Architecture & Tech Stack

- **Framework**: Astro (v5+) with SSR mode
- **Deployment**: Cloudflare Workers with Pages adapter
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 for manga images
- **Styling**: Tailwind CSS v4 with Flowbite components
- **TypeScript**: Strict mode enabled

## Code Style Guidelines

### File Organization
```
src/
├── pages/              # Astro file-based routing
│   ├── api/           # API endpoints
│   └── [...route].astro # Dynamic routes
├── lib/               # Shared utilities and database functions
├── styles/            # Global styles and Tailwind imports
├── middleware.ts      # Astro middleware for caching headers
└── env.d.ts          # TypeScript environment declarations
```

### Imports
- Use relative imports for internal modules: `import { getVolumes } from "../lib/db"`
- Use absolute imports for dependencies: `import type { APIRoute } from "astro"`
- Group imports: 1) Node/Astro imports, 2) third-party, 3) local imports
- Type imports use `import type` when possible

### TypeScript Patterns
- Use strict TypeScript config (extends `astro/tsconfigs/strict`)
- Define explicit types for API responses and database queries
- Use type annotations for function parameters and returns
- Leverage Astro's built-in types: `APIRoute`, `AstroGlobal`, `APIContext`

### Astro Components
- Use frontmatter (---) for server-side logic
- Import global CSS at top: `import "../styles/global.css"`
- Use HTML5 semantic elements appropriately
- Include proper meta tags for SEO and accessibility
- Use `Astro.redirect()` for invalid routes/params

### Database Operations
- Database connection: `const db = Astro.locals.runtime?.env?.vagabond_db`
- Always validate database exists before use
- Use prepared statements with parameter binding for security
- Return `null` for not-found results, handle in calling code
- Use TypeScript generics for query result typing

### API Routes
- Export `GET`, `POST`, etc. functions of type `APIRoute`
- Return proper HTTP status codes (404 for not found, 500 for errors)
- Set appropriate `Content-Type` headers
- Include cache headers for static content
- Use JSON error responses with descriptive messages

### Styling Guidelines
- Use Tailwind utility classes for layout and spacing
- Use Flowbite components for UI elements
- Custom CSS only for animations or complex interactions
- Mobile-first responsive design approach
- Semantic color palette: grays for UI, brand colors for accents

### Error Handling
- Validate required environment variables and database connections
- Use try-catch for async operations that might fail
- Return user-friendly error pages via Astro.redirect()
- Log errors appropriately for debugging
- Gracefully handle missing images/data

### Performance & Caching
- Use `loading="lazy"` for images below fold
- Implement caching headers via middleware
- Optimize images for web delivery
- Use Astro's `is:inline` sparingly for critical scripts
- Leverage Cloudflare's edge caching

### Naming Conventions
- Files: kebab-case for pages (`volume-[volume].astro`), camelCase for functions
- Variables: camelCase, descriptive names
- Constants: UPPER_SNAKE_CASE for static values
- Functions: verb-based names (`getVolumes`, `getChapterDetails`)
- CSS classes: Tailwind utilities, custom classes use kebab-case

### Security Best Practices
- Sanitize all user input and URL parameters
- Use parameterized queries for database operations
- Validate route parameters before processing
- Never expose sensitive data or API keys in client code
- Implement proper CORS headers for API endpoints

## Special Considerations

### Manga Content
- This application serves copyrighted manga content for personal reference only
- All content must be properly licensed or fall under fair use
- Never include actual manga scans in the repository
- Respect copyright notices and licensing terms

### Cloudflare Integration
- D1 database bindings are configured in `wrangler.jsonc`
- Environment variables accessed via `Astro.locals.runtime.env`
- Use `wrangler` CLI for local development and deployment
- Assets are served from Cloudflare's edge network

### Content Delivery
- Images are hosted on external CDN (`bucket.readbagabondo.com`)
- Implement proper fallbacks for missing content
- Use appropriate caching strategies for different content types
- Optimize for both mobile and desktop reading experiences

## Deployment Notes

- Production deployment: `wrangler deploy`
- Database migrations must be run manually via wrangler CLI
- Assets are automatically uploaded during build process
- Monitor Cloudflare Analytics for performance metrics
- Keep wrangler.jsonc in sync with production setup