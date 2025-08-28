# Overview

This is a full-stack web application for managing a football tournament called "Copa Libertadores de Plato". The application serves as a tournament management system with both public viewing and admin management capabilities. It features a classic sports website design similar to Promiedos, displaying fixtures, team information, standings, and historical champions data.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite as the build tool. The UI follows a component-based architecture with shadcn/ui components for consistent styling. The application uses Wouter for lightweight routing and TanStack Query for efficient data fetching and caching. Tailwind CSS provides utility-first styling with a custom design system focused on a sports website aesthetic.

## Backend Architecture
The server runs on Express.js with TypeScript, implementing a RESTful API design. The architecture separates concerns into distinct layers: route handlers, storage abstraction, and database access. Authentication is handled via JWT tokens for admin access, while public endpoints remain open for tournament viewing.

## Database Design
The system uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema supports a complete tournament structure including teams, countries, phases (groups, quarters, semis, final), matches, group standings, champions history, and team statistics. Relationships are properly defined to support complex tournament bracket structures.

## State Management
The frontend uses TanStack Query for server state management, providing automatic caching, background updates, and optimistic updates. Local state is managed through React hooks, with form state handled by React Hook Form with Zod validation schemas shared between client and server.

## Authentication & Authorization
The system implements JWT-based authentication for admin users. Admin routes are protected both on the frontend (conditional rendering) and backend (middleware verification). Public tournament data remains accessible without authentication to allow general viewing.

## Component Architecture
The UI is structured with reusable components organized by feature areas. The main pages (home, tournament, admin) coordinate multiple specialized components (fixture tabs, team management, match management). All components use TypeScript for type safety and follow React best practices.

# External Dependencies

## Core Framework Dependencies
- **React 18** - Frontend framework with hooks and modern patterns
- **Express.js** - Backend web framework for Node.js
- **Vite** - Fast development build tool with HMR support
- **TypeScript** - Type safety across the entire stack

## Database & ORM
- **PostgreSQL** - Primary database via @neondatabase/serverless
- **Drizzle ORM** - Type-safe database queries and migrations
- **Drizzle Kit** - Database schema management and migrations

## UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built accessible React components
- **Radix UI** - Primitive components for complex UI patterns
- **Lucide React** - Icon library

## Data Management
- **TanStack React Query** - Server state management and caching
- **React Hook Form** - Form state management with validation
- **Zod** - Schema validation shared between client and server

## Authentication & Security
- **JWT** - Token-based authentication (mocked in current implementation)
- **bcrypt** - Password hashing (mocked in current implementation)

## Development Tools
- **Wouter** - Lightweight React router
- **date-fns** - Date manipulation utilities
- **clsx & class-variance-authority** - Conditional CSS class management