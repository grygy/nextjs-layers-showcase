import { getDependencyRegistry } from './dependencyRegistry';

export async function exampleServerAction() {
  'use server';
  
  const registry = getDependencyRegistry();
  const users = await registry.userFacade.getAllUsers();
  return users;
}

export async function GET() {
  const registry = getDependencyRegistry();
  const users = await registry.userFacade.getAllUsers();
  
  return Response.json(users);
}

export async function exampleServerComponent() {
  const registry = getDependencyRegistry();
  const users = await registry.userFacade.getAllUsers();
  
  return users;
}

export async function exampleDirectServiceAccess() {
  const registry = getDependencyRegistry();
  const userExists = await registry.userService.userExists('some-id');
  return userExists;
}

export async function exampleDirectRepositoryAccess() {
  const registry = getDependencyRegistry();
  const users = await registry.userRepository.findAll();
  return users;
}

export async function exampleMultipleFacades() {
  const registry = getDependencyRegistry();
  const users = await registry.userFacade.getAllUsers();
  
  return { users };
}

export async function exampleTypeSafeAccess() {
  const registry = getDependencyRegistry();
  const user = await registry.userFacade.getUserById('some-id');
  
  console.log(user.id, user.name);
  
  return user;
}

