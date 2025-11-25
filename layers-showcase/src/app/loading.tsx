export default function Loading() {
  return (
    <div className="p-8">
      <div className="animate-pulse">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mt-2"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mt-1"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mt-1"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mt-1"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mt-1"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mt-2"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mt-2"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mt-2"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mt-2"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mt-2"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mt-2"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mt-2"></div>
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mt-2"></div>
      </div>
      <div className="animate-pulse">
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

