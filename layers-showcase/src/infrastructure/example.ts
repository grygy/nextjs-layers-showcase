/**
 * This file demonstrates various ways to use the DependencyRegistry
 * in different parts of your Next.js application.
 */

import { getDependencyRegistry } from './dependencyRegistry';

// ============================================================================
// EXAMPLE 1: Using in Server Actions
// ============================================================================

export async function exampleServerAction() {
  'use server';
  
  // Get the singleton registry instance
  const registry = getDependencyRegistry();
  
  // Use the facade layer (recommended for external-facing operations)
  const users = await registry.userFacade.getAllUsers();
  return users;
}

// ============================================================================
// EXAMPLE 2: Using in API Routes
// ============================================================================

export async function GET() {
  const registry = getDependencyRegistry();
  
  // The facade handles validation and mapping
  const users = await registry.userFacade.getAllUsers();
  
  return Response.json(users);
}

// ============================================================================
// EXAMPLE 3: Using in Server Components
// ============================================================================

export async function exampleServerComponent() {
  const registry = getDependencyRegistry();
  const users = await registry.userFacade.getAllUsers();
  
  // In a real component, you would return JSX like:
  // return (
  //   <div>
  //     {users.map((user) => (
  //       <div key={user.id}>{user.name}</div>
  //     ))}
  //   </div>
  // );
  
  return users;
}

// ============================================================================
// EXAMPLE 4: Direct Service Access (when you need domain logic)
// ============================================================================

export async function exampleDirectServiceAccess() {
  const registry = getDependencyRegistry();
  
  // Sometimes you might want to bypass the facade and use the service directly
  // This is useful when you're already in a trusted context and don't need
  // the facade's validation/mapping
  const userExists = await registry.userService.userExists('some-id');
  return userExists;
}

// ============================================================================
// EXAMPLE 5: Direct Repository Access (rare, but possible)
// ============================================================================

export async function exampleDirectRepositoryAccess() {
  const registry = getDependencyRegistry();
  
  // Direct repository access is rarely needed, but available if you need
  // to bypass both service and facade layers
  const users = await registry.userRepository.findAll();
  return users;
}

// ============================================================================
// EXAMPLE 6: Accessing Multiple Facades
// ============================================================================

export async function exampleMultipleFacades() {
  const registry = getDependencyRegistry();
  
  // When your registry grows, you'll have multiple facades
  // All facades share the same underlying database connection
  const users = await registry.userFacade.getAllUsers();
  
  // If you had a postFacade:
  // const posts = await registry.postFacade.getAllPosts();
  
  return { users };
}

// ============================================================================
// EXAMPLE 7: Type-Safe Access
// ============================================================================

export async function exampleTypeSafeAccess() {
  const registry = getDependencyRegistry();
  
  // All registry properties are fully typed
  // TypeScript will autocomplete and type-check everything
  const user = await registry.userFacade.getUserById('some-id');
  
  // TypeScript knows the exact shape of the return type
  console.log(user.id, user.name);
  
  return user;
}

// ============================================================================
// NOTES:
// ============================================================================
// 
// 1. Always use getDependencyRegistry() instead of importing classes directly
// 2. The registry ensures all dependencies are properly wired together
// 3. In production, the registry is a singleton (same instance everywhere)
// 4. In tests, you can create new registry instances with test dependencies
// 5. The facade layer should be your primary entry point for most operations
//

