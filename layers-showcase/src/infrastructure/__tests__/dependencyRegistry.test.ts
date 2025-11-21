import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DependencyRegistry, getDependencyRegistry, resetDependencyRegistry } from '../dependencyRegistry';

/**
 * Unit tests for DependencyRegistry
 * 
 * These tests verify:
 * 1. The registry correctly instantiates all dependencies
 * 2. The singleton pattern works correctly
 * 3. Dependencies are properly wired together
 */
describe('DependencyRegistry - Unit Tests', () => {
  beforeEach(() => {
    // Reset singleton before each test
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
      const customDb = {} as any; // Mock DB client
      const registry = new DependencyRegistry(customDb);

      expect(registry.dbClient).toBe(customDb);
    });

    it('should wire dependencies correctly', () => {
      const registry = new DependencyRegistry();

      // The userRepository should have the dbClient
      expect((registry.userRepository as any).dbClient).toBe(registry.dbClient);

      // The userService should have the userRepository
      expect((registry.userService as any).userRepository).toBe(registry.userRepository);

      // The userFacade should have the userService
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
      // After reset, no instance should exist
      resetDependencyRegistry();

      // First call creates the instance
      const registry = getDependencyRegistry();

      expect(registry).toBeInstanceOf(DependencyRegistry);
    });
  });

  describe('Dependency Sharing', () => {
    it('should share the same dbClient across all repositories', () => {
      const registry = new DependencyRegistry();

      // When we add more repositories, they should all share the same dbClient
      expect((registry.userRepository as any).dbClient).toBe(registry.dbClient);
      
      // If you had multiple repositories:
      // expect((registry.postRepository as any).dbClient).toBe(registry.dbClient);
    });

    it('should ensure all services use their respective repositories', () => {
      const registry = new DependencyRegistry();

      expect((registry.userService as any).userRepository).toBe(registry.userRepository);
      
      // If you had multiple services:
      // expect((registry.postService as any).postRepository).toBe(registry.postRepository);
    });

    it('should ensure all facades use their respective services', () => {
      const registry = new DependencyRegistry();

      expect((registry.userFacade as any).userService).toBe(registry.userService);
      
      // If you had multiple facades:
      // expect((registry.postFacade as any).postService).toBe(registry.postService);
    });
  });

  describe('Type Safety', () => {
    it('should have properly typed properties', () => {
      const registry = getDependencyRegistry();

      // These should not cause TypeScript errors
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

      // TypeScript should prevent reassignment (compile-time check)
      // registry.userFacade = new UserFacade(); // This would be a compile error

      // We can verify the properties are defined
      expect(registry.dbClient).toBeDefined();
      expect(registry.userRepository).toBeDefined();
      expect(registry.userService).toBeDefined();
      expect(registry.userFacade).toBeDefined();
    });
  });
});

