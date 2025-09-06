# Overview

AthletiQon is a comprehensive athletic performance tracking and analysis platform built as a full-stack web application. The system allows athletes to record fitness test results, track performance progress over time, compete on leaderboards, and view detailed analytics. The application features user authentication via Replit Auth, a modern React frontend with shadcn/ui components, and a robust Express.js backend with PostgreSQL database integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript and Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query for server state and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation resolvers

**Key Design Decisions**:
- Component-based architecture with reusable UI components
- Responsive design with mobile-first approach and dedicated mobile navigation
- Dark theme optimized for sports/fitness aesthetics
- Real-time data updates via query invalidation patterns

## Backend Architecture

**Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Passport.js with OpenID Connect (Replit Auth)
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with consistent error handling

**Key Design Decisions**:
- Middleware-based request processing with logging and error handling
- Type-safe database operations using Drizzle schema definitions
- Centralized storage abstraction layer for database operations
- Session-based authentication with cookie security for production

## Data Storage Architecture

**Database**: PostgreSQL with Neon serverless connection pooling
- **Schema Management**: Drizzle migrations with schema definitions in shared directory
- **Data Models**: Users, athlete profiles, test types, test results, achievements, and user achievements
- **Relationships**: Foreign key constraints with cascade deletions for data integrity

**Key Design Decisions**:
- Normalized schema design with proper relational structure
- UUID primary keys for scalability and security
- JSON fields for flexible session storage
- Indexes on frequently queried columns (sessions expire field)

## Authentication System

**Strategy**: OpenID Connect via Replit's identity provider
- **User Management**: Automatic user creation/update on successful authentication
- **Authorization**: Route-level middleware protection for authenticated endpoints
- **Session Security**: HTTP-only cookies with secure flags and TTL expiration

**Key Design Decisions**:
- Stateful session management for better security vs stateless JWT
- Automatic user profile synchronization from identity provider
- Graceful handling of authentication failures with redirect flows

## API Structure

**Endpoints**:
- `/api/auth/*` - Authentication and user management
- `/api/athlete-profile` - Athlete profile CRUD operations
- `/api/test-types` - Test type management and retrieval
- `/api/test-results` - Test result recording and analytics
- `/api/leaderboards/*` - State and national ranking systems
- `/api/achievements/*` - Achievement system and user progress
- `/api/analytics` - Performance analytics and trends

**Key Design Decisions**:
- Consistent JSON responses with error message structure
- Request/response logging for debugging and monitoring
- Input validation using Zod schemas shared between client and server
- Parameterized queries for performance and security

# External Dependencies

## Core Infrastructure
- **Neon Database**: Serverless PostgreSQL with connection pooling via `@neondatabase/serverless`
- **Replit Auth**: OpenID Connect authentication provider for user management
- **WebSocket Support**: Node.js `ws` library for Neon database connections

## UI and Styling
- **Radix UI**: Headless component primitives for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Web fonts (Inter, DM Sans, Geist Mono, Fira Code)

## Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Frontend build tool with hot module replacement
- **ESBuild**: Backend bundling for production deployment
- **Drizzle Kit**: Database schema management and migrations

## Runtime Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for API contracts
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Component variant management