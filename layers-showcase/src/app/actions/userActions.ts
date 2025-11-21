'use server';

import { getDependencyRegistry } from '@/infrastructure';
import type { UserOutput } from '@/facade/schemas/userSchema';

export async function getAllUsersAction(): Promise<UserOutput[]> {
  try {
    const registry = getDependencyRegistry();
    return await registry.userFacade.getAllUsers();
  } catch (error) {
    console.error('Error in getAllUsersAction:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function getUserByIdAction(id: string): Promise<UserOutput | null> {
  try {
    const registry = getDependencyRegistry();
    return await registry.userFacade.getUserByIdOrNull(id);
  } catch (error) {
    console.error('Error in getUserByIdAction:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function createUserAction(data: unknown): Promise<UserOutput> {
  try {
    const registry = getDependencyRegistry();
    return await registry.userFacade.createUser(data);
  } catch (error) {
    console.error('Error in createUserAction:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create user');
  }
}

export async function updateUserAction(id: string, data: unknown): Promise<UserOutput> {
  try {
    const registry = getDependencyRegistry();
    return await registry.userFacade.updateUser(id, data);
  } catch (error) {
    console.error('Error in updateUserAction:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update user');
  }
}

export async function deleteUserAction(id: string): Promise<void> {
  try {
    const registry = getDependencyRegistry();
    await registry.userFacade.deleteUser(id);
  } catch (error) {
    console.error('Error in deleteUserAction:', error);
    throw new Error('Failed to delete user');
  }
}

