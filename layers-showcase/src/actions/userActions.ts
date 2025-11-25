'use server';

import type { UserOutput } from '@/facade/schemas/userSchema';
import { getDependencyRegistry } from '@/infrastructure/dependencyRegistry';
import { busyWait } from '@/utils/busyWait';
import { refresh } from 'next/cache';

export async function getAllUsersAction(): Promise<[UserOutput[] | null, string | null]> {
  try {
    await busyWait(2000);
    const registry = getDependencyRegistry();
    const users = await registry.userFacade.getAllUsers();
    return [users, null];
  } catch (error) {
    console.error('Error in getAllUsersAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    return [null, errorMessage];
  }
}

export async function getUserByIdAction(id: string): Promise<[UserOutput | null, string | null]> {
  try {
    await busyWait(2000);
    const registry = getDependencyRegistry();
    const user = await registry.userFacade.getUserByIdOrNull(id);
    return [user, null];
  } catch (error) {
    console.error('Error in getUserByIdAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
    return [null, errorMessage];
  }
}

export async function createUserAction(data: unknown): Promise<[UserOutput | null, string | null]> {
  try {
    await busyWait(2000);
    const registry = getDependencyRegistry();
    const user = await registry.userFacade.createUser(data);
    refresh();
    return [user, null];
  } catch (error) {
    console.error('Error in createUserAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return [null, errorMessage];
  }
}

export async function updateUserAction(id: string, data: unknown): Promise<[UserOutput | null, string | null]> {
  try {
    await busyWait(2000);
    const registry = getDependencyRegistry();
    const user = await registry.userFacade.updateUser(id, data);
    refresh();
    return [user, null];
  } catch (error) {
    console.error('Error in updateUserAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
    return [null, errorMessage];
  }
}

export async function deleteUserAction(id: string): Promise<[boolean, string | null]> {
  try {
    await busyWait(2000);
    const registry = getDependencyRegistry();
    await registry.userFacade.deleteUser(id);
    refresh();
    return [true, null];
  } catch (error) {
    console.error('Error in deleteUserAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
    return [false, errorMessage];
  }
}

