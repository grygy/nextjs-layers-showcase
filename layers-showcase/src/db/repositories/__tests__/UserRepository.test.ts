import type { User } from '@/domain/models/User';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearTestDb, createTestDb } from '../../../__tests__/testDb';
import { UserRepository } from '../UserRepository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let testDb: ReturnType<typeof createTestDb>;

  beforeEach(() => {
    testDb = createTestDb();
    clearTestDb(testDb);
    repository = new UserRepository(testDb);
  });

  describe('findAll', () => {
    it('should return an empty array when no users exist', async () => {
      const users = await repository.findAll();
      expect(users).toEqual([]);
    });

    it('should return all users', async () => {
      const user1: User = { id: '1', name: 'John Doe' };
      const user2: User = { id: '2', name: 'Jane Smith' };

      await repository.create(user1);
      await repository.create(user2);

      const users = await repository.findAll();
      expect(users).toHaveLength(2);
      expect(users).toEqual(expect.arrayContaining([user1, user2]));
    });
  });

  describe('findById', () => {
    it('should return null when user does not exist', async () => {
      const user = await repository.findById('non-existent-id');
      expect(user).toBeNull();
    });

    it('should return user when user exists', async () => {
      const newUser: User = { id: 'test-id', name: 'Test User' };
      await repository.create(newUser);

      const user = await repository.findById('test-id');
      expect(user).toEqual(newUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser: User = { id: 'test-id', name: 'New User' };

      const createdUser = await repository.create(newUser);
      expect(createdUser).toEqual(newUser);

      const foundUser = await repository.findById('test-id');
      expect(foundUser).toEqual(newUser);
    });

    it('should create multiple users', async () => {
      const user1: User = { id: '1', name: 'User One' };
      const user2: User = { id: '2', name: 'User Two' };

      await repository.create(user1);
      await repository.create(user2);

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should return null when user does not exist', async () => {
      const updatedUser = await repository.update('non-existent-id', { name: 'New Name' });
      expect(updatedUser).toBeNull();
    });

    it('should update existing user', async () => {
      const user: User = { id: 'test-id', name: 'Original Name' };
      await repository.create(user);

      const updatedUser = await repository.update('test-id', { name: 'Updated Name' });
      expect(updatedUser).toEqual({ id: 'test-id', name: 'Updated Name' });

      const foundUser = await repository.findById('test-id');
      expect(foundUser?.name).toBe('Updated Name');
    });
  });

  describe('delete', () => {
    it('should return false when user does not exist', async () => {
      const result = await repository.delete('non-existent-id');
      expect(result).toBe(false);
    });

    it('should delete existing user and return true', async () => {
      const user: User = { id: 'test-id', name: 'Test User' };
      await repository.create(user);

      const result = await repository.delete('test-id');
      expect(result).toBe(true);

      const foundUser = await repository.findById('test-id');
      expect(foundUser).toBeNull();
    });

    it('should only delete the specified user', async () => {
      const user1: User = { id: '1', name: 'User One' };
      const user2: User = { id: '2', name: 'User Two' };
      await repository.create(user1);
      await repository.create(user2);

      await repository.delete('1');

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0]).toEqual(user2);
    });
  });
});

