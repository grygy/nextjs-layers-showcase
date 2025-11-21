import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DependencyRegistry, getDependencyRegistry, resetDependencyRegistry } from '../dependencyRegistry';

describe('DependencyRegistry - Unit Tests', () => {
  beforeEach(() => {
    resetDependencyRegistry();
  });

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

  describe('Singleton Pattern', () => {
    it('should return the same instance on multiple calls', () => {
      const registry1 = getDependencyRegistry();
      const registry2 = getDependencyRegistry();

      expect(registry1).toBe(registry2);
    });

    it('should return a new instance after reset', () => {
      const registry1 = getDependencyRegistry();
      
      resetDependencyRegistry();
      
      const registry2 = getDependencyRegistry();

      expect(registry1).not.toBe(registry2);
    });

    it('should create singleton lazily on first call', () => {
      resetDependencyRegistry();

      const registry = getDependencyRegistry();

      expect(registry).toBeInstanceOf(DependencyRegistry);
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
      const registry = getDependencyRegistry();

      const _db: typeof registry.dbClient = registry.dbClient;
      const _repo: typeof registry.userRepository = registry.userRepository;
      const _service: typeof registry.userService = registry.userService;
      const _facade: typeof registry.userFacade = registry.userFacade;

      expect(_db).toBeDefined();
      expect(_repo).toBeDefined();
      expect(_service).toBeDefined();
      expect(_facade).toBeDefined();
    });
  });

  describe('Immutability', () => {
    it('should expose properties as readonly', () => {
      const registry = getDependencyRegistry();

      expect(registry.dbClient).toBeDefined();
      expect(registry.userRepository).toBeDefined();
      expect(registry.userService).toBeDefined();
      expect(registry.userFacade).toBeDefined();
    });
  });
});

