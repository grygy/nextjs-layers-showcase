import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DependencyRegistry, resetDependencyRegistry } from '../dependencyRegistry';
import { createTestDb } from '@/__tests__/testDb';
import type { DbClient } from '@/db/client';

/**
 * Integration tests for DependencyRegistry
 * 
 * These tests demonstrate:
 * 1. How to create a registry with a test database
 * 2. How to test the entire stack from facade to database
 * 3. How to properly clean up between tests
 */
describe('DependencyRegistry - Integration Tests', () => {
  let registry: DependencyRegistry;
  let testDb: DbClient;

  beforeEach(() => {
    // Reset the singleton to ensure clean state
    resetDependencyRegistry();
    
    // Create a test database
    testDb = createTestDb();
    
    // Create a registry with the test database
    registry = new DependencyRegistry(testDb);
  });

  afterEach(() => {
    // Clean up
    resetDependencyRegistry();
  });

  describe('Full Stack Integration', () => {
    it('should create and retrieve a user through the entire stack', async () => {
      // Create a user through the facade
      const createdUser = await registry.userFacade.createUser({ name: 'Integration Test User' });

      // Verify the user was created
      expect(createdUser.id).toBeDefined();
      expect(createdUser.name).toBe('Integration Test User');

      // Retrieve the user through the facade
      const retrievedUser = await registry.userFacade.getUserById(createdUser.id);
      expect(retrievedUser).toEqual(createdUser);
    });

    it('should handle user updates through the entire stack', async () => {
      // Create a user
      const createdUser = await registry.userFacade.createUser({ name: 'Original Name' });

      // Update the user
      const updatedUser = await registry.userFacade.updateUser(createdUser.id, { name: 'Updated Name' });

      // Verify the update
      expect(updatedUser.id).toBe(createdUser.id);
      expect(updatedUser.name).toBe('Updated Name');

      // Verify through retrieval
      const retrievedUser = await registry.userFacade.getUserById(createdUser.id);
      expect(retrievedUser.name).toBe('Updated Name');
    });

    it('should handle user deletion through the entire stack', async () => {
      // Create a user
      const createdUser = await registry.userFacade.createUser({ name: 'To Be Deleted' });

      // Verify user exists
      const exists = await registry.userFacade.userExists(createdUser.id);
      expect(exists).toBe(true);

      // Delete the user
      await registry.userFacade.deleteUser(createdUser.id);

      // Verify user no longer exists
      const existsAfterDeletion = await registry.userFacade.userExists(createdUser.id);
      expect(existsAfterDeletion).toBe(false);
    });

    it('should retrieve all users through the facade', async () => {
      // Create multiple users
      await registry.userFacade.createUser({ name: 'User One' });
      await registry.userFacade.createUser({ name: 'User Two' });
      await registry.userFacade.createUser({ name: 'User Three' });

      // Retrieve all users
      const users = await registry.userFacade.getAllUsers();

      // Verify all users are returned
      expect(users).toHaveLength(3);
      expect(users.map(u => u.name)).toEqual(['User One', 'User Two', 'User Three']);
    });
  });

  describe('Layer Access', () => {
    it('should allow direct service access', async () => {
      // Create a user through facade
      const user = await registry.userFacade.createUser({ name: 'Service Test User' });

      // Access directly through service
      const serviceUser = await registry.userService.getUserById(user.id);
      
      expect(serviceUser.id).toBe(user.id);
      expect(serviceUser.name).toBe('Service Test User');
    });

    it('should allow direct repository access', async () => {
      // Create a user through facade
      const user = await registry.userFacade.createUser({ name: 'Repository Test User' });

      // Access directly through repository
      const repoUser = await registry.userRepository.findById(user.id);
      
      expect(repoUser).not.toBeNull();
      expect(repoUser!.id).toBe(user.id);
      expect(repoUser!.name).toBe('Repository Test User');
    });

    it('should share the same database connection across all layers', async () => {
      // Create a user through the repository with a valid UUID v4
      const testUuid = '12345678-1234-4234-a234-123456789012';
      const repoUser = await registry.userRepository.create({
        id: testUuid,
        name: 'Repo Created User',
      });

      // Verify it's accessible through the service
      const serviceUser = await registry.userService.getUserById(repoUser.id);
      expect(serviceUser.id).toBe(repoUser.id);

      // Verify it's accessible through the facade
      const facadeUser = await registry.userFacade.getUserById(repoUser.id);
      expect(facadeUser.id).toBe(repoUser.id);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from service to facade', async () => {
      // Try to get a non-existent user
      await expect(
        registry.userFacade.getUserById('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow('User with id 00000000-0000-0000-0000-000000000000 not found');
    });

    it('should handle validation errors at facade level', async () => {
      // Try to create a user with invalid data
      await expect(
        registry.userFacade.createUser({ name: '' })
      ).rejects.toThrow(); // Zod validation error
    });

    it('should handle update of non-existent user', async () => {
      await expect(
        registry.userFacade.updateUser('00000000-0000-0000-0000-000000000000', { name: 'New Name' })
      ).rejects.toThrow('User with id 00000000-0000-0000-0000-000000000000 not found');
    });

    it('should handle deletion of non-existent user', async () => {
      await expect(
        registry.userFacade.deleteUser('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow('User with id 00000000-0000-0000-0000-000000000000 not found');
    });
  });

  describe('Dependency Injection', () => {
    it('should use the injected database client', () => {
      // Verify that the registry is using our test database
      expect(registry.dbClient).toBe(testDb);
    });

    it('should wire all dependencies correctly', () => {
      // Verify all properties are defined
      expect(registry.dbClient).toBeDefined();
      expect(registry.userRepository).toBeDefined();
      expect(registry.userService).toBeDefined();
      expect(registry.userFacade).toBeDefined();
    });
  });
});

