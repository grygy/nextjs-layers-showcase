import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserFacade } from '../userFacade';
import { UserService } from '@/domain/services/UserService';
import type { User } from '@/domain/models/User';
import { ZodError } from 'zod';

vi.mock('@/domain/services/UserService');

describe('UserFacade', () => {
  let facade: UserFacade;
  let mockService: {
    getAllUsers: ReturnType<typeof vi.fn>;
    getUserById: ReturnType<typeof vi.fn>;
    getUserByIdOrNull: ReturnType<typeof vi.fn>;
    createUser: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
    userExists: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockService = {
      getAllUsers: vi.fn(),
      getUserById: vi.fn(),
      getUserByIdOrNull: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      userExists: vi.fn(),
    };

    facade = new UserFacade(mockService as unknown as UserService);
  });

  describe('getAllUsers', () => {
    it('should return all users mapped to output format', async () => {
      const mockUsers: User[] = [
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'User One' },
        { id: '123e4567-e89b-12d3-a456-426614174001', name: 'User Two' },
      ];
      mockService.getAllUsers.mockResolvedValue(mockUsers);

      const users = await facade.getAllUsers();

      expect(users).toEqual([
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'User One' },
        { id: '123e4567-e89b-12d3-a456-426614174001', name: 'User Two' },
      ]);
      expect(mockService.getAllUsers).toHaveBeenCalledOnce();
    });

    it('should return empty array when no users exist', async () => {
      mockService.getAllUsers.mockResolvedValue([]);

      const users = await facade.getAllUsers();

      expect(users).toEqual([]);
      expect(mockService.getAllUsers).toHaveBeenCalledOnce();
    });
  });

  describe('getUserById', () => {
    it('should return user when valid UUID is provided', async () => {
      const mockUser: User = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' };
      mockService.getUserById.mockResolvedValue(mockUser);

      const user = await facade.getUserById('123e4567-e89b-12d3-a456-426614174000');

      expect(user).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' });
      expect(mockService.getUserById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw validation error when invalid UUID is provided', async () => {
      await expect(facade.getUserById('invalid-uuid')).rejects.toThrow(ZodError);
      expect(mockService.getUserById).not.toHaveBeenCalled();
    });
  });

  describe('getUserByIdOrNull', () => {
    it('should return user when valid UUID is provided and user exists', async () => {
      const mockUser: User = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' };
      mockService.getUserByIdOrNull.mockResolvedValue(mockUser);

      const user = await facade.getUserByIdOrNull('123e4567-e89b-12d3-a456-426614174000');

      expect(user).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' });
      expect(mockService.getUserByIdOrNull).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return null when user does not exist', async () => {
      mockService.getUserByIdOrNull.mockResolvedValue(null);

      const user = await facade.getUserByIdOrNull('123e4567-e89b-12d3-a456-426614174000');

      expect(user).toBeNull();
      expect(mockService.getUserByIdOrNull).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw validation error when invalid UUID is provided', async () => {
      await expect(facade.getUserByIdOrNull('invalid-uuid')).rejects.toThrow(ZodError);
      expect(mockService.getUserByIdOrNull).not.toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create user with valid input', async () => {
      const createdUser: User = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'New User' };
      mockService.createUser.mockResolvedValue(createdUser);

      const user = await facade.createUser({ name: 'New User' });

      expect(user).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000', name: 'New User' });
      expect(mockService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New User',
          id: expect.any(String),
        })
      );
    });

    it('should throw validation error when name is empty', async () => {
      await expect(facade.createUser({ name: '' })).rejects.toThrow(ZodError);
      expect(mockService.createUser).not.toHaveBeenCalled();
    });

    it('should throw validation error when name is missing', async () => {
      await expect(facade.createUser({})).rejects.toThrow(ZodError);
      expect(mockService.createUser).not.toHaveBeenCalled();
    });

    it('should throw validation error when name exceeds max length', async () => {
      const longName = 'a'.repeat(101);
      await expect(facade.createUser({ name: longName })).rejects.toThrow(ZodError);
      expect(mockService.createUser).not.toHaveBeenCalled();
    });

    it('should accept name at max length', async () => {
      const maxLengthName = 'a'.repeat(100);
      const createdUser: User = { id: '123e4567-e89b-12d3-a456-426614174000', name: maxLengthName };
      mockService.createUser.mockResolvedValue(createdUser);

      const user = await facade.createUser({ name: maxLengthName });

      expect(user.name).toBe(maxLengthName);
      expect(mockService.createUser).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user with valid input', async () => {
      const updatedUser: User = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Updated Name' };
      mockService.updateUser.mockResolvedValue(updatedUser);

      const user = await facade.updateUser('123e4567-e89b-12d3-a456-426614174000', { name: 'Updated Name' });

      expect(user).toEqual({ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Updated Name' });
      expect(mockService.updateUser).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', { name: 'Updated Name' });
    });

    it('should throw validation error when invalid UUID is provided', async () => {
      await expect(facade.updateUser('invalid-uuid', { name: 'New Name' })).rejects.toThrow(ZodError);
      expect(mockService.updateUser).not.toHaveBeenCalled();
    });

    it('should throw validation error when name is empty', async () => {
      await expect(facade.updateUser('123e4567-e89b-12d3-a456-426614174000', { name: '' })).rejects.toThrow(ZodError);
      expect(mockService.updateUser).not.toHaveBeenCalled();
    });

    it('should throw validation error when name is missing', async () => {
      await expect(facade.updateUser('123e4567-e89b-12d3-a456-426614174000', {})).rejects.toThrow(ZodError);
      expect(mockService.updateUser).not.toHaveBeenCalled();
    });

    it('should throw validation error when name exceeds max length', async () => {
      const longName = 'a'.repeat(101);
      await expect(facade.updateUser('123e4567-e89b-12d3-a456-426614174000', { name: longName })).rejects.toThrow(ZodError);
      expect(mockService.updateUser).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete user with valid UUID', async () => {
      mockService.deleteUser.mockResolvedValue(undefined);

      await facade.deleteUser('123e4567-e89b-12d3-a456-426614174000');

      expect(mockService.deleteUser).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw validation error when invalid UUID is provided', async () => {
      await expect(facade.deleteUser('invalid-uuid')).rejects.toThrow(ZodError);
      expect(mockService.deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('userExists', () => {
    it('should return true when user exists', async () => {
      mockService.userExists.mockResolvedValue(true);

      const exists = await facade.userExists('123e4567-e89b-12d3-a456-426614174000');

      expect(exists).toBe(true);
      expect(mockService.userExists).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return false when user does not exist', async () => {
      mockService.userExists.mockResolvedValue(false);

      const exists = await facade.userExists('123e4567-e89b-12d3-a456-426614174000');

      expect(exists).toBe(false);
      expect(mockService.userExists).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw validation error when invalid UUID is provided', async () => {
      await expect(facade.userExists('invalid-uuid')).rejects.toThrow(ZodError);
      expect(mockService.userExists).not.toHaveBeenCalled();
    });
  });
});

