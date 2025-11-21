import { db, type DbClient } from '@/db/client';
import { UserRepository } from '@/db/repositories/UserRepository';
import { UserService } from '@/domain/services/UserService';
import { UserFacade } from '@/facade/userFacade';

export class DependencyRegistry {
  public readonly dbClient: DbClient;
  public readonly userRepository: UserRepository;
  public readonly userService: UserService;
  public readonly userFacade: UserFacade;

  constructor(dbClient: DbClient = db) {
    this.dbClient = dbClient;
    this.userRepository = new UserRepository(this.dbClient);
    this.userService = new UserService(this.userRepository);
    this.userFacade = new UserFacade(this.userService);
  }
}

let dependencyRegistry: DependencyRegistry | null = null;

export function getDependencyRegistry(): DependencyRegistry {
  if (!dependencyRegistry) {
    dependencyRegistry = new DependencyRegistry();
  }
  return dependencyRegistry;
}

export function resetDependencyRegistry(): void {
  dependencyRegistry = null;
}

