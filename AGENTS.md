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

# Cloudflare testing
pnpm wrangler dev     # Local development with Workers runtime (includes local D1 database)
```

### Database Commands

```bash
# Run migrations (local)
for migration in drizzle/migrations/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$migration"
done

# Run seeds (local)
for seed in seeds/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$seed"
done

# Reset local database
rm -rf .wrangler/state/
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

- **Primary Database**: `Astro.locals.runtime?.env?.bagabondo_db` (main application)
- **Legacy Database**: `Astro.locals.runtime?.env?.vagabond_db` (API v1 only, temporary during migration)
- Always validate database exists before use
- Use prepared statements with parameter binding for security
- Return `null` for not-found results, handle in calling code
- Use TypeScript generics for query result typing
- **Migration Note**: API will migrate to `bagabondo_db` and Drizzle ORM once v2 specification is complete

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

### Caching Strategy

The application implements Cloudflare Cache API with different TTLs per route:

- **Homepage** (`/`): 1 week cache
- **Chapter pages** (`/volume-[volume]/chapter-[chapter]`): 1 month cache (immutable flag)
- **Volume pages** (`/volume-[volume]`): 1 week cache (immutable flag)
- **API endpoints**: Cached based on content type and update frequency

Implemented in `src/middleware.ts` for request-time cache header injection.

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

## State Management

### Reader State (nanostores)

The application uses nanostores for lightweight reactive state management:

```typescript
// Reader store atoms
const currentPage = atom<number>(0); // Current page index
const percentageRead = atom<number>(0); // Reading progress percentage
const navbarVisibility = atom<boolean>(true); // UI navbar toggle
const isProgrammaticScroll = atom<boolean>(false); // Scroll source flag
```

Usage:

- Import atoms from `src/feature/reader/store.ts`
- Subscribe to changes with `subscribe()` or use in Astro components
- Update state with `set()` or `update()`
- Keep store values immutable

**Location**: `src/feature/reader/store.ts`

## Components & Architecture

### Astro Components

The application includes 12 Astro components for UI rendering:

- `ArrowIcon.astro` - Navigation arrow icon
- `ArrowKeysHint.astro` - Keyboard navigation hint text
- `ChapterList.astro` - List of chapters for a volume
- `ChapterNavigation.astro` - Chapter navigation controls
- `Footer.astro` - Page footer
- `MetadataTags.astro` - SEO meta tags
- `Navigation.astro` - Main navigation bar
- `PageViewer.astro` - Cascade reader component (main reading interface)
- `ProgressBar.astro` - Reading progress bar
- `VolumeCard.astro` - Volume preview card
- `VolumeCover.astro` - Volume cover image
- `VolumeInformation.astro` - Volume metadata display

All components are located in `src/components/`.

## Image Delivery

### Content Delivery Network (CDN)

Manga images are served from external CDN:

- **CDN URL**: `https://bucket.readbagabondo.com/`
- **Backend**: Cloudflare R2 object storage
- **Fallback**: Implement proper fallback handling for missing images
- **Optimization**: Images are optimized for web delivery (compression, format negotiation)

### Image Loading Strategy

- Use `loading="lazy"` for chapter images to optimize initial page load
- Preload cover images for improved perceived performance
- Implement lazy-loading for pagination to conserve bandwidth

## SEO & Structured Data

### Metadata & Schemas

The application implements comprehensive structured data for search engines:

**Location**: `src/lib/metadata.ts`

Supported schemas:

- **WebSite schema**: Site-level metadata and search action
- **ComicSeries schema**: Vagabond series metadata
- **BreadcrumbList**: Navigation breadcrumbs (volume, chapter)
- **Book schema**: Per-volume metadata
- **ComicIssue schema**: Per-chapter metadata

**Note**: Chapter count is currently hardcoded to 327; update this when retrieving from database.

Usage:

- Import metadata functions in page components
- Use `<MetadataTags>` component to inject structured data into page head
- Verify structured data with Google Rich Results Test

## TypeScript Environment

### Type Declarations

Custom TypeScript definitions for Cloudflare Workers and Astro runtime:

- `src/env.d.ts` - Astro environment and runtime type declarations
- `worker-configuration.d.ts` - Cloudflare Workers type definitions
- Database bindings accessed via `Astro.locals.runtime?.env?.<binding_name>`

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
- Use `wrangler` CLI for local development with `pnpm wrangler dev`
- Production deployment is automatic on merge to `main` branch
- Assets are served from Cloudflare's edge network

### Content Delivery

- Images served from R2 CDN at `https://bucket.readbagabondo.com/`
- Implement proper fallbacks for missing content
- Use appropriate caching strategies for different content types
- Optimize for both mobile and desktop reading experiences

## Deployment Notes

- **Production deployment**: Automatic on merge to `main` branch
- **Database migrations**: Run locally with `pnpm wrangler d1 execute` before deployment
- **Assets**: Automatically uploaded during build process
- **Monitoring**: Check Cloudflare Analytics for performance metrics
- **Configuration**: Keep wrangler.jsonc in sync with production settings
- **No manual deployment needed**: Cloudflare Workers handles all production infrastructure

## Development Workflow

### Trunk-Based Development

This project uses trunk-based development with `main` as the primary branch:

- All feature branches are created from `main`
- All PRs merge directly to `main`
- Every merge to `main` triggers automatic production deployment
- No long-lived development branches

**Branch strategy**:

- `main`: Production trunk (all development happens here)
- `feat/*`: Short-lived feature branches
- `fix/*`: Short-lived bug fix branches
- `mihon-api-v2/*`: Short-lived API v2 feature branches
- `docs/*`: Documentation update branches

**Workflow**:

1. Create feature branch from `main`
2. Develop and test locally
3. Open PR targeting `main`
4. CodeRabbit reviews + Cloudflare build checks
5. Maintainer approval required
6. Merge to `main` → automatic deployment

### Feature Flags

For incomplete or risky features that need to be merged before they're user-ready:

**Implementation**:

```typescript
const ENABLE_FEATURE = import.meta.env.PUBLIC_ENABLE_FEATURE === "true";

if (ENABLE_FEATURE) {
  // Feature code
}
```

**Usage**:

- Use environment variables to toggle features
- Keep features disabled in production until thoroughly tested
- Deploy code to `main` but activate only when ready
- Ideal for: large features requiring multiple PRs, A/B testing, gradual rollouts

### Breaking Changes

When implementing breaking API changes:

- Version API endpoints (`/api/v1/`, `/api/v2/`)
- Document all breaking changes in PR description
- Provide migration guide for external integrations
- Notify external integration maintainers (Keiyoushi extension)
- Require maintainer approval for database schema changes

### PR Testing

**Local testing** (test your own changes):

```bash
pnpm dev                      # Astro dev server
pnpm wrangler dev             # Cloudflare Workers runtime
pnpm build && pnpm preview    # Production build
```

**Testing others' PRs** (for code review):

```bash
# Using GitHub CLI
gh pr checkout <pr-number>

# Or manually
git fetch origin pull/<pr-number>/head:pr-<pr-number>
git checkout pr-<pr-number>

# Then test
pnpm install
pnpm dev
```

**All merges require**: CodeRabbit review passed + Cloudflare build successful + maintainer approval.
