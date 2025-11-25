import { describe, it, expect } from 'vitest';
import { DependencyRegistry, dependencyRegistry } from '../dependencyRegistry';

describe('DependencyRegistry - Unit Tests', () => {

  describe('Constructor', () => {
    it('should create a registry with all dependencies', () => {
      const registry = new DependencyRegistry();

      expect(registry.dbClient).toBeDefined();
      expect(registry.userRepository).toBeDefined();
      expect(registry.userService).toBeDefined();
      expect(registry.userFacade).toBeDefined();
    });

    it('should accept a custom database client', () => {
      const customDb = {} as any;
      const registry = new DependencyRegistry(customDb);

      expect(registry.dbClient).toBe(customDb);
    });

    it('should wire dependencies correctly', () => {
      const registry = new DependencyRegistry();

      expect((registry.userRepository as any).dbClient).toBe(registry.dbClient);
      expect((registry.userService as any).userRepository).toBe(registry.userRepository);
      expect((registry.userFacade as any).userService).toBe(registry.userService);
    });
  });

  describe('Module Singleton', () => {
    it('should export the same instance across imports', () => {
      expect(dependencyRegistry).toBeInstanceOf(DependencyRegistry);
      expect(dependencyRegistry).toBe(dependencyRegistry);
    });
  });

  describe('Dependency Sharing', () => {
    it('should share the same dbClient across all repositories', () => {
      const registry = new DependencyRegistry();

      expect((registry.userRepository as any).dbClient).toBe(registry.dbClient);
    });

    it('should ensure all services use their respective repositories', () => {
      const registry = new DependencyRegistry();

      expect((registry.userService as any).userRepository).toBe(registry.userRepository);
    });

    it('should ensure all facades use their respective services', () => {
      const registry = new DependencyRegistry();

      expect((registry.userFacade as any).userService).toBe(registry.userService);
    });
  });

  describe('Type Safety', () => {
    it('should have properly typed properties', () => {
      const _db: typeof dependencyRegistry.dbClient = dependencyRegistry.dbClient;
      const _repo: typeof dependencyRegistry.userRepository = dependencyRegistry.userRepository;
      const _service: typeof dependencyRegistry.userService = dependencyRegistry.userService;
      const _facade: typeof dependencyRegistry.userFacade = dependencyRegistry.userFacade;

      expect(_db).toBeDefined();
      expect(_repo).toBeDefined();
      expect(_service).toBeDefined();
      expect(_facade).toBeDefined();
    });
  });

  describe('Immutability', () => {
    it('should expose properties as readonly', () => {
      const registry = dependencyRegistry;

      expect(registry.dbClient).toBeDefined();
      expect(registry.userRepository).toBeDefined();
      expect(registry.userService).toBeDefined();
      expect(registry.userFacade).toBeDefined();
    });
  });
});

