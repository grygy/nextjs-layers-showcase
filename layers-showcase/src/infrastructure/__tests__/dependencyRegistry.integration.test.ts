import { describe, it, expect, beforeEach } from 'vitest';
import { DependencyRegistry } from '../dependencyRegistry';
import { createTestDb } from '@/__tests__/testDb';
import type { DbClient } from '@/db/client';

describe('DependencyRegistry - Integration Tests', () => {
  let registry: DependencyRegistry;
  let testDb: DbClient;

  beforeEach(() => {
    testDb = createTestDb();
    registry = new DependencyRegistry(testDb);
  });

  describe('Full Stack Integration', () => {
    it('should create and retrieve a user through the entire stack', async () => {
      const createdUser = await registry.userFacade.createUser({ name: 'Integration Test User' });

      expect(createdUser.id).toBeDefined();
      expect(createdUser.name).toBe('Integration Test User');

      const retrievedUser = await registry.userFacade.getUserById(createdUser.id);
      expect(retrievedUser).toEqual(createdUser);
    });

    it('should handle user updates through the entire stack', async () => {
      const createdUser = await registry.userFacade.createUser({ name: 'Original Name' });

      const updatedUser = await registry.userFacade.updateUser(createdUser.id, { name: 'Updated Name' });

      expect(updatedUser.id).toBe(createdUser.id);
      expect(updatedUser.name).toBe('Updated Name');

      const retrievedUser = await registry.userFacade.getUserById(createdUser.id);
      expect(retrievedUser.name).toBe('Updated Name');
    });

    it('should handle user deletion through the entire stack', async () => {
      const createdUser = await registry.userFacade.createUser({ name: 'To Be Deleted' });

      const exists = await registry.userFacade.userExists(createdUser.id);
      expect(exists).toBe(true);

      await registry.userFacade.deleteUser(createdUser.id);

      const existsAfterDeletion = await registry.userFacade.userExists(createdUser.id);
      expect(existsAfterDeletion).toBe(false);
    });

    it('should retrieve all users through the facade', async () => {
      await registry.userFacade.createUser({ name: 'User One' });
      await registry.userFacade.createUser({ name: 'User Two' });
      await registry.userFacade.createUser({ name: 'User Three' });

      const users = await registry.userFacade.getAllUsers();

      expect(users).toHaveLength(3);
      expect(users.map(u => u.name)).toEqual(['User One', 'User Two', 'User Three']);
    });
  });

  describe('Layer Access', () => {
    it('should allow direct service access', async () => {
      const user = await registry.userFacade.createUser({ name: 'Service Test User' });

      const serviceUser = await registry.userService.getUserById(user.id);
      
      expect(serviceUser.id).toBe(user.id);
      expect(serviceUser.name).toBe('Service Test User');
    });

    it('should allow direct repository access', async () => {
      const user = await registry.userFacade.createUser({ name: 'Repository Test User' });

      const repoUser = await registry.userRepository.findById(user.id);
      
      expect(repoUser).not.toBeNull();
      expect(repoUser!.id).toBe(user.id);
      expect(repoUser!.name).toBe('Repository Test User');
    });

    it('should share the same database connection across all layers', async () => {
      const testUuid = '12345678-1234-4234-a234-123456789012';
      const repoUser = await registry.userRepository.create({
        id: testUuid,
        name: 'Repo Created User',
      });

      const serviceUser = await registry.userService.getUserById(repoUser.id);
      expect(serviceUser.id).toBe(repoUser.id);

      const facadeUser = await registry.userFacade.getUserById(repoUser.id);
      expect(facadeUser.id).toBe(repoUser.id);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from service to facade', async () => {
      await expect(
        registry.userFacade.getUserById('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow('User with id 00000000-0000-0000-0000-000000000000 not found');
    });

    it('should handle validation errors at facade level', async () => {
      await expect(
        registry.userFacade.createUser({ name: '' })
      ).rejects.toThrow();
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
      expect(registry.dbClient).toBe(testDb);
    });

    it('should wire all dependencies correctly', () => {
      expect(registry.dbClient).toBeDefined();
      expect(registry.userRepository).toBeDefined();
      expect(registry.userService).toBeDefined();
      expect(registry.userFacade).toBeDefined();
    });
  });
});

