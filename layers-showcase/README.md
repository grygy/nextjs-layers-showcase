# Next.js 16 - 3-Layer Architecture Showcase

A demonstration of clean 3-layer backend architecture with Domain-Driven Design (DDD) principles in Next.js 16.

## Features

- ✅ **3-Layer Architecture**: Facade → Domain → Database
- ✅ **No Type Leakage**: Manual mappers between all layers
- ✅ **Repository Pattern**: Clean database abstraction
- ✅ **Zod Validation**: Input validation at facade layer
- ✅ **Drizzle ORM**: Type-safe database operations
- ✅ **Domain-Driven Design**: Pure domain models with no dependencies
- ✅ **Async Throughout**: All operations are async
- ✅ **TypeScript**: Fully typed with strict mode

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
npm run db:push
```

### 3. Seed Sample Data

```bash
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. View the Demo

Open [http://localhost:3000/users](http://localhost:3000/users) to see the user list.

## Architecture

This project implements a clean 3-layer architecture:

```
Presentation → Facade → Domain → Database
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## Project Structure

```
src/
├── app/
│   ├── users/page.tsx          # Demo page (RSC)
│   └── actions/userActions.ts  # Server Actions (example)
├── facade/
│   ├── userFacade.ts          # Facade with validation
│   └── schemas/userSchema.ts  # Zod schemas
├── domain/
│   ├── models/User.ts         # Pure TS domain model
│   └── services/UserService.ts # Business logic
└── db/
    ├── schema.ts              # Drizzle schema
    ├── client.ts              # DB connection
    ├── seed.ts                # Seed script
    └── repositories/
        └── UserRepository.ts  # Repository pattern
```

## Available Scripts

### Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database

```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (GUI)
npm run db:seed      # Seed sample data
```

## Usage Example

### Using the Facade

The facade is the entry point for all operations:

```typescript
import { userFacade } from '@/facade/userFacade';

// Create user
const user = await userFacade.createUser({ name: 'John Doe' });

// Get all users
const users = await userFacade.getAllUsers();

// Get user by ID
const user = await userFacade.getUserById(1);

// Update user
const updated = await userFacade.updateUser(1, { name: 'Jane Doe' });

// Delete user
await userFacade.deleteUser(1);
```

### From Server Actions

```typescript
'use server';

import { userFacade } from '@/facade/userFacade';

export async function createUserAction(formData: FormData) {
  const user = await userFacade.createUser({
    name: formData.get('name'),
  });
  return user;
}
```

### From React Server Components

```typescript
import { userFacade } from '@/facade/userFacade';

export default async function UsersPage() {
  const users = await userFacade.getAllUsers();
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

## Key Design Principles

### 1. No Type Leakage

Each layer has isolated types with manual mapping:

- **Facade**: Zod schemas and types
- **Domain**: Pure TypeScript types  
- **Database**: Drizzle ORM types

### 2. Repository Pattern

Repositories abstract database operations and handle mapping between domain and ORM models.

### 3. Manual Mappers

All data flows through explicit mapper functions:

```typescript
// Facade → Domain
#mapCreateInputToDomain(input: CreateUserInput): CreateUserData {
  return { name: input.name };
}

// Domain → Output
#mapDomainToOutput(user: User): UserOutput {
  return { id: user.id, name: user.name };
}
```

### 4. Validation at the Edge

Input validation happens at the facade layer using Zod before data enters the domain.

### 5. Pure Domain Layer

The domain layer has zero external dependencies - pure TypeScript types and business logic.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type safety
- **Drizzle ORM** - Type-safe database toolkit
- **Better SQLite3** - Local SQLite database
- **Zod** - Schema validation
- **Tailwind CSS 4** - Styling

## Database Schema

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- UUID stored as text
  name TEXT NOT NULL
);
```

## Testing the Architecture

You can test the architecture by:

1. Opening [http://localhost:3000/users](http://localhost:3000/users)
2. Using Drizzle Studio: `npm run db:studio`
3. Creating server actions that use the facade
4. Adding more CRUD operations

## Benefits

- **Maintainable**: Clear separation of concerns
- **Testable**: Easy to mock each layer
- **Flexible**: Swap implementations without affecting other layers
- **Type-Safe**: Strong typing throughout
- **Scalable**: Architecture supports growth

## Learn More

- [Architecture Documentation](./ARCHITECTURE.md) - Detailed architecture guide
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Zod](https://zod.dev)

## License

MIT
