# Contributing to Read Vagabond Manga

Thank you for your interest in contributing to Read Vagabond Manga! We welcome all contributions and are excited to have you join our project.

## Project Overview

Read Vagabond Manga is a manga reader web application for Takehiko Inoue's masterpiece Vagabond. Built with Astro and deployed on Cloudflare Workers, it provides a minimalist, high-quality reading experience using D1 database for metadata and R2 for image storage.

> **Important**: This software is licensed under the MIT License, but this license does NOT grant any rights to manga content. Vagabond © Takehiko Inoue / Kodansha. This site is unofficial and provides content for personal reference only. All rights remain with the original creators and publishers.

**NO SCANS ARE PROVIDED IN THIS REPOSITORY.**

## Current Development Priorities

### Major Feature Development (targeting `dev` branch)

We're actively working on these high-impact features:

1. **Single Page Reader (Alternative Reading Mode)**
   - Implement single-page horizontal navigation as an alternative to current cascade layout
   - Canvas-based rendering with smooth page flip transitions
   - Thumbnail navigation sidebar/bottom panel
   - Reading progress indicator adapted for single-page navigation
   - RTL mode: mirrored navigation controls, reversed keyboard shortcuts (← becomes next, → becomes previous)
   - Mobile gesture support implementation
   - Page preloading for smooth transitions

2. **Dark Mode Implementation**
   - Theme system with manual toggle
   - Integration with Tailwind/Flowbite patterns
   - Theme persistence via localStorage
   - No automatic dark mode based on system preference

3. **Comment Sections (per Chapter & Volume)**
   - Database schema design for chapter/volume comments
   - API routes for comment CRUD operations
   - UI components using existing Tailwind/Flowbite patterns
   - Reading progress tracking per chapter

4. **Chapter Selection UI Improvements**
   - Manual chapter navigation within reader interface (currently requires going back to volume page)
   - Integration with volume/chapter data structure
   - Reading progress display for each chapter

### Mihon API Modernization

- **Current Status**: Mihon API v1 is in production and will be deprecated
- **Next Phase**: Mihon API v2 is in design/thinking phase (not yet implemented)
- **Current Target**: Focus on main app features; API v2 work pending design completion

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Git
- Cloudflare account (for deploying to production, optional for local development)

### Setup for Contributors

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone <your-fork-url>
cd read-vagabond

# 3. Install dependencies
pnpm install

# 4. Set up local D1 database (required for development)
# Run all migrations first, then all seeds
for migration in drizzle/migrations/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$migration"
done
for seed in seeds/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$seed"
done

# 5. Checkout appropriate branch for your contribution
git checkout dev  # All current contributions target dev branch

# 6. Create feat branch
# For features:
git checkout -b feat/single-page-reader
git checkout -b feat/dark-mode
git checkout -b feat/comment-system
git checkout -b feat/chapter-selection

# For API work:
git checkout -b mihon-api-v2/infrastructure
git checkout -b mihon-api-v2/endpoints

# 7. Start development server
pnpm dev               # Local development server with D1 database
pnpm wrangler dev      # Local development with Workers runtime and D1 database
```

### Database Setup Details

The application uses Cloudflare D1 database for storing chapter metadata. For local development:

- **Local Database**: Runs in memory using `wrangler d1 execute --local`
- **Database Files**: Migrations are in the `drizzle/migrations/` directory, seeds in `seeds/`
- **Database Name**: `bagabondo-db` (configured in `wrangler.jsonc`)
- **Persistence**: Local database state is stored in `.wrangler/state/` directory
- **Note**: Database is transitioning from `vagabond_db` to `bagabondo_db`; API currently uses legacy `vagabond_db` (temporary during migration)

**Running Migrations**:

```bash
# Run all migrations at once
for migration in drizzle/migrations/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$migration"
done

# Run all seeds at once
for seeds in seeds/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$seeds"
done

# Or run individual migrations
pnpm wrangler d1 execute bagabondo-db --local --file=./drizzle/migrations/0000_complex_mimic.sql
pnpm wrangler d1 execute bagabondo-db --local --file=./seeds/0000_seed_from_legacy.sql
```

**Reset Local Database** (if needed):

```bash
# Remove local database state
rm -rf .wrangler/state/

# Re-run migrations
for migration in drizzle/migrations/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$migration"
done

# Re-run seeds
for seeds in seeds/*.sql; do
  pnpm wrangler d1 execute bagabondo-db --local --file="$seeds"
done
```

### Development Commands

```bash
pnpm dev               # Start local development server with D1 database
pnpm build             # Build for production
pnpm preview           # Preview production build locally
pnpm wrangler dev      # Local development with Workers runtime and D1 database
```

### Cloudflare Authentication (Optional)

- **For Local Development**: No Cloudflare account required - wrangler works locally
- **For Deployment**: Cloudflare account needed for `git push` to main branch (auto-deploys)
- **For Remote Database Testing**: Cloudflare account needed for `wrangler d1 execute --remote`

**Login to Cloudflare (when needed)**:

```bash
pnpm wrangler login     # Login to Cloudflare account
pnpm wrangler whoami    # Verify authentication
```

## Feature-Specific Implementation Guidelines

### Single Page Reader Implementation

**Current State**: Vertical cascade layout with continuous scrolling (default reader)
**Target State**: Single page horizontal navigation as optional alternative mode with LTR/RTL support

**Technical Requirements**:

- Use canvas for page rendering (not image elements)
- Implement page flip transitions between pages
- Add thumbnail navigation panel (sidebar or bottom)
- Show reading progress for single-page navigation
- RTL Mode: Mirror navigation controls, reverse keyboard shortcuts
- Mobile: Implement swipe gestures for page navigation
- Performance: Preload next/previous pages for smooth transitions

**Files to Modify**:

- `src/pages/volume-[volume]/chapter-[chapter]/index.astro` (main reading interface)
- `src/feature/reading/` (add reading direction context)
- `src/styles/global.css` (add canvas and transition styles)

### Dark Mode Implementation

**Current State**: Light theme only, no theme system
**Target State**: Manual dark mode toggle with persistence

**Technical Requirements**:

- Create theme context/store for state management
- Add dark mode classes to Tailwind configuration
- Implement theme toggle UI component
- Store theme preference in localStorage
- Update all page templates to use theme classes

**Files to Modify**:

- `src/feature/theme/` (add theme context)
- `src/styles/global.css` (dark mode CSS variables)
- All page templates (add theme class bindings)

### Comment System Implementation

**Current State**: No comment functionality
**Target State**: Per chapter and volume discussions

**Technical Requirements**:

- Design database schema for comments (users, comments, reactions)
- Create API routes for CRUD operations
- Build comment UI components using Tailwind/Flowbite
- Integrate with existing chapter/volume structure

**Files to Create/Modify**:

- `migrations/` (add comment database schema)
- `src/feature/comments/` (add comment functions)
- Page templates (add comment components)

### Chapter Selection UI Implementation

**Current State**: Users must go back to volume page to change chapters
**Target State**: Chapter selection within reading interface

**Technical Requirements**:

- Add chapter navigation dropdown/sidebar in reader
- Display reading progress per chapter
- Integrate with existing volume/chapter data structure

**Files to Modify**:

- `src/pages/volume-[volume]/chapter-[chapter]/index.astro` (add chapter selector)

### Mihon API v2 Development

**Current State**: Mihon API v1 with hardcoded values and workarounds
**Target State**: Redesigned API supporting multiple works and localization

**Technical Requirements**:

- Remove hardcoded values and workarounds
- Design flexible API structure for multiple manga works
- Support for multi-language/localization
- Integration with manga reader applications

## Branch Strategy & Submission Process

### Branch Structure

- `main`: Stable production (auto-deploys to Cloudflare)
- `dev`: All development work (features + API v2)
- `feat/mihon-api-v2`: Future dedicated API branch (currently in idea phase)

### Targeting Rules

- **All current contributions**: Target `dev` branch
- **Future API v2 dedicated work**: Will target `feat/mihon-api-v2` branch

### Branch Naming Conventions

- Features: `feat/single-page-reader`, `feat/dark-mode`
- API work: `mihon-api-v2/infrastructure`, `mihon-api-v2/endpoints`
- Bug fixes: `fix/reading-progress`, `fix/navigation-issue`

### Pull Request Workflow

1. Fork the repository
2. Clone your fork locally
3. Checkout `dev` branch
4. Create feature branch with proper naming convention
5. Develop and test your changes
6. Open pull request targeting `dev` branch
7. Code review and merge process
8. `dev` to `main` merge triggers automatic Cloudflare deployment

### Merge Strategy

- Current: All work merges to `dev`
- Future: Once Mihon API v2 design is finalized:
  - API v2 implementation will target `feat/mihon-api-v2` branch
  - Branch will be merged back to `dev` for integration
  - Then `dev` to `main` for automatic Cloudflare deployment

## Technical Guidelines

### Code Style & Standards

- Follow detailed guidelines in [AGENTS.md](./AGENTS.md)
- Use TypeScript strict mode
- Follow Astro SSR patterns
- Implement proper error handling and validation
- Use Tailwind utility classes, Flowbite components
- Mobile-first responsive design approach

### Database Operations

- Use D1 database with proper connection handling
- Always validate database exists before use
- Use prepared statements with parameter binding
- Return `null` for not-found results
- Use TypeScript generics for query result typing

### API Development

- Export typed functions: `GET`, `POST`, etc. of type `APIRoute`
- Return proper HTTP status codes
- Set appropriate `Content-Type` headers
- Include cache headers for static content
- Use JSON error responses with descriptive messages

### Security Best Practices

- Sanitize all user input and URL parameters
- Use parameterized queries for database operations
- Validate route parameters before processing
- Never expose sensitive data or API keys
- Implement proper CORS headers for API endpoints

## Commit Message Conventions

We follow **Conventional Commits** format to maintain consistency and enable automated changelog generation.

### Format

```
<type>: <description>
```

### Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting/style changes (no functional changes)
- `refactor`: Code refactoring without functional changes
- `test`: Adding/updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements

### Examples

- `feat: implement single page canvas rendering`
- `fix: resolve chapter data timeout issue`
- `docs: update setup instructions for local dev`
- `refactor: extract common database utilities`
- `style: adjust dark mode toggle positioning`
- `test: add unit tests for page navigation`
- `chore: update tailwind to v4.2.0`
- `perf: optimize image loading for large chapters`

## Pull Request Title Conventions

PR titles follow the same format as commit messages for consistency.

### Format

```
<type>: <description>
```

### Guidelines

- Keep titles under 72 characters
- Use present tense ("add" not "added")
- Include issue numbers when applicable
- Be specific about what the PR does

### Examples

- `feat: add LTR/RTL reading direction support`
- `fix: resolve chapter count calculation error`
- `docs: update Mihon API v2 documentation`
- `refactor: extract common page layout components`
- `perf: improve image caching strategy`

## Pull Request Description Guidelines

Clear PR descriptions help reviewers understand your changes quickly. Use this template:

### Required Sections

```markdown
## Problem/Motivation

Brief description of what problem this change addresses and why it's needed.

## Implementation

How the change was implemented, including technical details and any important decisions made.

## Testing

How this was tested:

- Manual testing steps performed
- Devices/browsers checked
- Specific functionality verified

## Breaking Changes

List any breaking changes or note "None" if there are none.

## Related Issues

Closes #123, Related to #456, or "None"
```

### Examples by Contribution Type

**Feature Example:**

```markdown
## Problem/Motivation

Users currently cannot switch between chapters without returning to volume page, creating a poor reading experience.

## Implementation

Added chapter selection dropdown in reader sidebar that:

- Fetches all chapters from current volume
- Maintains current reading position
- Updates URL for bookmarking
- Includes reading progress indicators

## Testing

- Tested chapter navigation in volume 4
- Verified dropdown works on mobile and desktop
- Confirmed reading position is preserved
- Checked bookmark functionality with new URLs

## Breaking Changes

None

## Related Issues

Closes #87
```

**Bug Fix Example:**

```markdown
## Problem/Motivation

Chapter pages were not loading correctly due to database timeout issue after 30 seconds.

## Implementation

- Added connection timeout handling in database queries
- Implemented retry mechanism for failed requests
- Added proper error messaging for users

## Testing

- Reproduced original timeout issue
- Verified fix works consistently
- Tested error handling scenarios
- Checked mobile and desktop compatibility

## Breaking Changes

None

## Related Issues

Closes #92
```

**API Development Example:**

```markdown
## Problem/Motivation

Mihon API v1 has hardcoded values that prevent multi-language support and future expansion.

## Implementation

- Refactored API structure to support dynamic manga data
- Added language parameter support
- Implemented new endpoint for manga metadata
- Updated response format for compatibility

## Testing

- Tested with existing Mihon client applications
- Verified backward compatibility
- Checked new language parameter functionality
- Validated response format matches expected schema

## Breaking Changes

API response format updated (backward compatible)

## Related Issues

Related to #45, Part of Mihon API v2 roadmap
```

## Testing Approach

Currently, this project uses manual testing rather than automated tests:

1. **Local Testing**: Run `pnpm dev` and test all user flows
2. **API Testing**: Test API endpoints directly
3. **Responsive Testing**: Verify functionality across devices
4. **Workers Testing**: Use `wrangler dev` for Cloudflare deployment testing

Before submitting a PR, please ensure:

- Your changes work as expected
- UI is responsive across different screen sizes
- API endpoints return correct responses
- No console errors or warnings

## Deployment Process

### Automatic Cloudflare Deployment

- **Trigger**: Any merge to `main` branch
- **Process**: Cloudflare automatically deploys to production
- **No manual steps required**: Cloudflare Workers handles all deployment infrastructure
- **Timeline**: Deployment completes within seconds of merge

### Development Deployment Flow

1. **Development**: `pnpm dev` for local Astro development
2. **Workers Testing**: `wrangler dev` for Cloudflare Workers runtime testing
3. **Production**: Merge `dev` to `main` triggers automatic Cloudflare deployment

## Community & Support

### Response Time Expectations

- PR reviews: Typically within 1-2 weeks
- Issue responses: Within 1 week for questions, sooner for bugs
- Feature requests: Will be evaluated against project roadmap

### Communication Channels

- GitHub Issues: Bug reports, feature requests, questions
- Pull Requests: Code contributions and reviews

### Security Disclosures

If you find a security vulnerability, do NOT open an issue. Please report it responsibly through appropriate channels.

## Important Disclaimers

### Licensing

- **Code**: Licensed under MIT License
- **Content**: No manga scans provided, respect copyright
- **Manga**: Vagabond © Takehiko Inoue / Kodansha

### Contribution Boundaries

- Code contributions are welcome and encouraged
- Do not submit manga scans or copyrighted content
- Respect licensing terms and copyright notices
- Focus on improving the reader application functionality

### Legal Notice

This site is unofficial and provides content for personal reference only. All rights remain with the original creators and publishers. Please support the official editions.

---

Thank you for contributing! Your help makes this project better for everyone interested in experiencing Takehiko Inoue's masterpiece.
