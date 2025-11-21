import { db, type DbClient } from '@/db/client';
import { UserRepository } from '@/db/repositories/UserRepository';
import { UserService } from '@/domain/services/UserService';
import { UserFacade } from '@/facade/userFacade';

/**
 * DependencyRegistry is responsible for instantiating and wiring up all application dependencies.
 * It follows the Dependency Injection pattern and ensures a single source of truth for object creation.
 * 
 * The hierarchy is:
 * DB Client -> Repository -> Service -> Facade
 */
export class DependencyRegistry {
  // Database layer
  public readonly dbClient: DbClient;
  
  // Repository layer
  public readonly userRepository: UserRepository;
  
  // Service layer (Domain)
  public readonly userService: UserService;
  
  // Facade layer
  public readonly userFacade: UserFacade;

  constructor(dbClient: DbClient = db) {
    // Initialize database client
    this.dbClient = dbClient;
    
    // Initialize repositories with database client
    this.userRepository = new UserRepository(this.dbClient);
    
    // Initialize services with repositories
    this.userService = new UserService(this.userRepository);
    
    // Initialize facades with services
    this.userFacade = new UserFacade(this.userService);
  }
}

// Singleton instance
let dependencyRegistry: DependencyRegistry | null = null;

/**
 * Returns the singleton instance of DependencyRegistry.
 * Creates a new instance if one doesn't exist.
 */
export function getDependencyRegistry(): DependencyRegistry {
  if (!dependencyRegistry) {
    dependencyRegistry = new DependencyRegistry();
  }
  return dependencyRegistry;
}

/**
 * Resets the singleton instance. Useful for testing.
 */
export function resetDependencyRegistry(): void {
  dependencyRegistry = null;
}

