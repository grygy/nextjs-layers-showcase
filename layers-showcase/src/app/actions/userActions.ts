'use server';

import { getDependencyRegistry } from '@/infrastructure/dependencyRegistry';
import type { UserOutput } from '@/facade/schemas/userSchema';
import { FetchUsersError, FetchUserError, CreateUserError, UpdateUserError, DeleteUserError } from '../errors/ActionError';

export async function getAllUsersAction(): Promise<UserOutput[]> {
  try {
    const registry = getDependencyRegistry();
    return await registry.userFacade.getAllUsers();
  } catch (error) {
    console.error('Error in getAllUsersAction:', error);
    throw new FetchUsersError(error);
  }
}

export async function getUserByIdAction(id: string): Promise<UserOutput | null> {
  try {
    const registry = getDependencyRegistry();
    return await registry.userFacade.getUserByIdOrNull(id);
  } catch (error) {
    console.error('Error in getUserByIdAction:', error);
    throw new FetchUserError(error);
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
    throw new CreateUserError(error);
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
    throw new UpdateUserError(error);
  }
}

export async function deleteUserAction(id: string): Promise<void> {
  try {
    const registry = getDependencyRegistry();
    await registry.userFacade.deleteUser(id);
  } catch (error) {
    console.error('Error in deleteUserAction:', error);
    throw new DeleteUserError(error);
  }
}

