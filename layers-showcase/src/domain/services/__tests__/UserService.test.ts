import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../UserService';
import { UserRepository } from '@/db/repositories/UserRepository';
import type { User } from '@/domain/models/User';
import { UserNotFoundError } from '@/domain/errors';

vi.mock('@/db/repositories/UserRepository');

describe('UserService', () => {
  let service: UserService;
  let mockRepository: {
    findAll: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new UserService(mockRepository as unknown as UserRepository);
  });

  describe('getAllUsers', () => {
    it('should return all users from repository', async () => {
      const mockUsers: User[] = [
        { id: '1', name: 'User One' },
        { id: '2', name: 'User Two' },
      ];
      mockRepository.findAll.mockResolvedValue(mockUsers);

      const users = await service.getAllUsers();

      expect(users).toEqual(mockUsers);
      expect(mockRepository.findAll).toHaveBeenCalledOnce();
    });

    it('should return empty array when no users exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const users = await service.getAllUsers();

      expect(users).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledOnce();
    });
  });

  describe('getUserById', () => {
    it('should return user when user exists', async () => {
      const mockUser: User = { id: '1', name: 'Test User' };
      mockRepository.findById.mockResolvedValue(mockUser);

      const user = await service.getUserById('1');

      expect(user).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById('non-existent')).rejects.toThrow(UserNotFoundError);
      await expect(service.getUserById('non-existent')).rejects.toThrow(
        'User with id non-existent not found'
      );
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('getUserByIdOrNull', () => {
    it('should return user when user exists', async () => {
      const mockUser: User = { id: '1', name: 'Test User' };
      mockRepository.findById.mockResolvedValue(mockUser);

      const user = await service.getUserByIdOrNull('1');

      expect(user).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const user = await service.getUserByIdOrNull('non-existent');

      expect(user).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('createUser', () => {
    it('should create and return new user', async () => {
      const newUser: User = { id: '1', name: 'New User' };
      mockRepository.create.mockResolvedValue(newUser);

      const createdUser = await service.createUser(newUser);

      expect(createdUser).toEqual(newUser);
      expect(mockRepository.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe('updateUser', () => {
    it('should update and return user when user exists', async () => {
      const updatedUser: User = { id: '1', name: 'Updated Name' };
      mockRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser('1', { name: 'Updated Name' });

      expect(result).toEqual(updatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith('1', { name: 'Updated Name' });
    });

    it('should throw error when user does not exist', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(service.updateUser('non-existent', { name: 'New Name' })).rejects.toThrow(UserNotFoundError);
      await expect(service.updateUser('non-existent', { name: 'New Name' })).rejects.toThrow(
        'User with id non-existent not found'
      );
      expect(mockRepository.update).toHaveBeenCalledWith('non-existent', { name: 'New Name' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user when user exists', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await service.deleteUser('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error when user does not exist', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.deleteUser('non-existent')).rejects.toThrow(UserNotFoundError);
      await expect(service.deleteUser('non-existent')).rejects.toThrow(
        'User with id non-existent not found'
      );
      expect(mockRepository.delete).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('userExists', () => {
    it('should return true when user exists', async () => {
      const mockUser: User = { id: '1', name: 'Test User' };
      mockRepository.findById.mockResolvedValue(mockUser);

      const exists = await service.userExists('1');

      expect(exists).toBe(true);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return false when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const exists = await service.userExists('non-existent');

      expect(exists).toBe(false);
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent');
    });
  });
});

