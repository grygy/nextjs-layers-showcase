'use client';

import { createUserAction } from '@/actions/userActions';
import type { CreateUserInput } from '@/facade/schemas/userSchema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function CreateUserForm() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    defaultValues: {
      name: '',
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const [user, error] = await createUserAction(data);
      if (error) {
        throw new Error(error);
      }
      return user;
    },
    onSuccess: () => {
      setSuccessMessage('User created successfully!');
      setErrorMessage(null);
      reset();
      // Invalidate queries to refresh the user list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    createUserMutation.mutate(data);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Create New User</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 1,
                message: 'Name must be at least 1 character',
              },
              maxLength: {
                value: 100,
                message: 'Name must be at most 100 characters',
              },
            })}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="Enter user name"
            disabled={createUserMutation.isPending}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={createUserMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
        >
          {createUserMutation.isPending ? 'Creating...' : 'Create User'}
        </button>

        {successMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              {errorMessage}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

