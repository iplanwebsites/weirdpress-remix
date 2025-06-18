# CLAUDE.md - Klepto Web Project

## Project Overview

**Klepto Web** (formerly "Raccook") is a recipe blog application built as a Remix app deployed on Cloudflare Workers. The site presents itself as "Recipes worth stealing" with a raccoon mascot theme. It's powered by the Repo-MD content management system for markdown-based content delivery.

## Tech Stack

### Core Framework
- **Remix v2.16.5** - Full-stack React framework
- **React 18.2.0** - UI library
- **TypeScript** - Type safety throughout
- **Vite** - Build tool and dev server

### Deployment & Hosting  
- **Cloudflare Workers** - Serverless deployment platform
- **Wrangler** - Cloudflare deployment tool
- **Node.js 20+** - Runtime requirement

### Styling & UI
- **Tailwind CSS v3.4.4** - Utility-first CSS framework
- **Tailwind Typography** - Enhanced typography plugin
- **PostCSS & Autoprefixer** - CSS processing
- **Lucide React** - Icon library
- **Dark mode support** - Class-based theme switching

### Content Management
- **Repo-MD** - Custom content management system
- **Markdown processing** - Content authored in markdown
- **Static asset CDN** - Images served from static.repo.md

### Development Tools
- **ESLint** - Code linting with React, TypeScript, and accessibility rules
- **TypeScript compiler** - Type checking
- **Miniflare** - Local Cloudflare Workers development

## Project Structure

```
/
├── app/                          # Remix application code
│   ├── components/              # Reusable React components
│   │   ├── BlogList.tsx        # Post listing component
│   │   ├── RecipeCard.tsx      # Recipe card component
│   │   ├── SearchBar.tsx       # Search functionality
│   │   ├── ThemeToggle.tsx     # Dark/light mode toggle
│   │   └── ...                 # Other UI components
│   ├── config/                 # Application configuration
│   │   └── navigation.ts       # Navigation menu configuration
│   ├── lib/                    # Utility functions and helpers
│   │   ├── postUtils.js        # Post filtering and categorization
│   │   └── ...                 # Other utilities
│   ├── routes/                 # Remix route handlers
│   │   ├── _index.tsx          # Homepage
│   │   ├── blog.$slug.tsx      # Individual blog posts
│   │   ├── recipes/            # Recipe-related routes
│   │   └── ...                 # Other routes
│   ├── types/                  # TypeScript type definitions
│   │   └── blog.ts             # Blog/post type definitions
│   ├── appConfig.js            # Main application configuration
│   ├── root.tsx                # Root layout component
│   └── entry.*.tsx             # Remix entry points
├── public/                     # Static assets
├── DEV/                        # Development documentation
├── build/                      # Build output (ignored)
├── package.json                # Dependencies and scripts
├── repo.js                     # Repo-MD client configuration
├── vite.config.ts              # Vite configuration
├── wrangler.toml               # Cloudflare Workers configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── .eslintrc.cjs               # ESLint configuration
```

## Key Architecture Concepts

### Content Management with Repo-MD
- Content is managed through the Repo-MD system (project ID: 6848af1cacdf98346841d302)
- Posts are categorized by file path structure (`recipes/`, `articles/`, etc.)
- Images are served from a CDN at `static.repo.md`
- Content can be fetched and cached with configurable expiry

### Post Classification System
The app uses a sophisticated post classification system in `app/lib/postUtils.js`:
- **Recipes**: Posts in `recipes/` folders
- **Articles**: General content in `articles/` folders (excluding guides)
- **Guides**: Specialized content in `articles/guides/` folders
- **Category extraction**: Based on folder structure

### Route Architecture
- **File-based routing** following Remix conventions
- **Dynamic routes** using `$slug` parameters
- **Nested layouts** with root layout in `root.tsx`
- **API routes** for search and other functionality

### Component Design Patterns
- **Compound components** (e.g., BlogList with RecipeCard)
- **Prop drilling avoided** through configuration objects
- **TypeScript interfaces** for all component props
- **Consistent naming** with PascalCase for components

## Development Commands

```bash
# Development
npm run dev                 # Start development server
npm start                   # Start with Wrangler (production-like)

# Build & Deploy
npm run build              # Build for production
npm run deploy             # Deploy to Cloudflare Workers

# Code Quality
npm run lint               # Run ESLint
npm run typecheck          # Run TypeScript compiler

# Utilities
npm run typegen            # Generate Cloudflare Workers types
npm run up                 # Update repo-md to latest
```

## Configuration Files

### App Configuration (`app/appConfig.js`)
Central configuration object containing:
- Site metadata (name, description, URLs)
- Repo-MD project settings
- CDN and asset URLs
- Feature flags and toggles
- Brand colors and logos
- Social media links
- SEO defaults

### Navigation (`app/config/navigation.ts`)
- Main navigation items
- Mobile-specific navigation
- Icon associations
- External link handling

## Content Structure & Conventions

### Post Frontmatter
Posts should include standard frontmatter:
```yaml
title: "Recipe Title"
date: "2024-01-01"
cover: "image-url"
featured: true/false
category: "category-name"
```

### Image Handling
- **Cover images**: Use `cover-md` for medium resolution
- **Fallback images**: Configured in appConfig.defaultImages
- **CDN optimization**: Multiple sizes available (-xs, -sm, -md, -lg, -xl)

### Content Categories
- **Recipe categories**: appetizers, main-courses, desserts, beverages, snacks
- **Cuisine types**: italian, mexican, asian, american, mediterranean  
- **Dietary tags**: vegetarian, vegan, gluten-free, keto, paleo

## Styling Guidelines

### Tailwind Usage
- **Dark mode**: Uses `dark:` prefixes with class-based switching
- **Responsive design**: Mobile-first approach with breakpoint prefixes
- **Component classes**: Avoid custom CSS when possible
- **Typography**: Uses Tailwind Typography plugin for content

### Design System
- **Colors**: Blue primary (#0969da), with dark mode variants
- **Typography**: Inter font family (system fallbacks)
- **Spacing**: Uses Tailwind's spacing scale
- **Shadows**: Subtle shadows for cards and elevated elements

## Data Flow & State Management

### Server-Side Data Loading
- **Loader functions** in route files handle data fetching
- **Repo-MD client** (`repo.js`) manages content API calls
- **Error boundaries** handle loading failures gracefully
- **Caching** configured at multiple levels

### Client-Side Interactions
- **Search functionality** with debounced input
- **Theme switching** persisted to localStorage
- **Navigation** using Remix Link components
- **Progressive enhancement** for all interactions

## SEO & Performance

### SEO Optimization
- **Meta tags** generated per route
- **Structured data** for recipes (potential)
- **OpenGraph** tags for social sharing
- **Sitemap** generation (via routes)

### Performance Features
- **Code splitting** via Remix route-based splitting
- **Image optimization** through CDN
- **Preconnect** hints for external resources
- **Asset preloading** for critical resources

## Development Workflow

### Code Organization
- **Feature-based organization** within routes
- **Shared components** in `/components` directory  
- **Utilities** separated by domain in `/lib`
- **Types** centralized in `/types` directory

### Code Quality
- **ESLint** with React, TypeScript, and accessibility rules
- **TypeScript strict mode** enabled
- **Import resolution** configured for `~/` alias
- **Consistent formatting** expected (consider adding Prettier)

## Deployment

### Cloudflare Workers Setup
- **Environment**: Configured via `wrangler.toml`
- **Static assets**: Served from `/build/client` directory
- **Build command**: `npm run build`
- **Domain**: Currently `klepto-web` on workers.dev

### Environment Variables
- Development secrets in `.dev.vars` (gitignored)
- Production secrets via Wrangler dashboard
- No sensitive data in committed files

## Special Features

### Theme System
- **Automatic dark mode** detection via media query
- **Manual toggle** with localStorage persistence
- **Inline script** prevents FOUC (Flash of Unstyled Content)
- **CSS custom properties** for theme values

### Search Functionality
- **Autocomplete API** at `/api/search/autocomplete`
- **Debounced input** to reduce API calls
- **Mobile-optimized** search interface

### Mermaid Diagram Support
The `/DEV` folder contains detailed instructions for implementing Mermaid diagram rendering with iframe-based architecture for security and performance.

## Notes for Future Development

### Immediate Opportunities
- Add Prettier for consistent code formatting
- Implement comprehensive testing (unit and E2E)
- Add CI/CD pipeline for automated deployment
- Consider adding a robots.txt and sitemap.xml

### Architecture Considerations
- The codebase follows Remix best practices consistently
- TypeScript usage is comprehensive but could be stricter in some utility files
- Error boundaries are implemented but could be more granular
- Performance monitoring could be added

### Content Strategy
- Recipe schema markup could be added for better SEO
- User-generated content features could be implemented
- Social sharing could be enhanced with better OpenGraph support
- Newsletter integration is configured but not implemented

This documentation provides a foundation for understanding and extending the Klepto Web application. The codebase demonstrates modern React/Remix patterns with good separation of concerns and maintainable architecture.