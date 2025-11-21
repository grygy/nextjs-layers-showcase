'use server';

import { userFacade } from '@/facade/userFacade';
import type { UserOutput } from '@/facade/schemas/userSchema';

export async function getAllUsersAction(): Promise<UserOutput[]> {
  try {
    return await userFacade.getAllUsers();
  } catch (error) {
    console.error('Error in getAllUsersAction:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function getUserByIdAction(id: string): Promise<UserOutput | null> {
  try {
    return await userFacade.getUserByIdOrNull(id);
  } catch (error) {
    console.error('Error in getUserByIdAction:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function createUserAction(data: unknown): Promise<UserOutput> {
  try {
    return await userFacade.createUser(data);
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
    return await userFacade.updateUser(id, data);
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
    await userFacade.deleteUser(id);
  } catch (error) {
    console.error('Error in deleteUserAction:', error);
    throw new Error('Failed to delete user');
  }
}

