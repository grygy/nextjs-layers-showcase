import { getAllUsersAction } from "@/actions/userActions";
import { CreateUserForm } from "@/components/CreateUserForm";

export default async function UsersPage() {
  const [users, error] = await getAllUsersAction();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CreateUserForm />
      
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        
          {error ? (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                Error: {error}
              </p>
            </div>
          ) : !users || users.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No users found. The database is empty.
          </p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-4 p-3 border border-zinc-200 dark:border-zinc-700 rounded"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{user.name}</span>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {user.id}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Architecture Demo</h3>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          This page demonstrates the 3-layer architecture with TanStack Query integration:
        </p>
        <ul className="text-sm text-zinc-700 dark:text-zinc-300 list-disc list-inside mt-2 space-y-1">
          <li><strong>Facade Layer:</strong> userFacade with Zod validation</li>
          <li><strong>Domain Layer:</strong> UserService with business logic</li>
          <li><strong>DB Layer:</strong> UserRepository with Drizzle ORM</li>
          <li><strong>UI Layer:</strong> React Hook Form + TanStack Query for mutations</li>
        </ul>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
          Each layer is isolated with manual mappers preventing type leakage. Server actions return [data, error] tuples for proper error handling.
        </p>
      </div>
    </div>
  );
}

