import type { UpdateUserData, User } from '@/domain/models/User';
import type { UserService } from '@/domain/services/UserService';
import { v4 as uuidv4 } from 'uuid';
import {
    createUserSchema,
    updateUserSchema,
    userIdSchema,
    type UpdateUserInput,
    type UserOutput,
} from './schemas/userSchema';

export class UserFacade {
  constructor(private readonly userService: UserService) {}

  #mapUpdateInputToDomain(input: UpdateUserInput): UpdateUserData {
    return {
      name: input.name,
    };
  }

  #mapDomainToOutput(user: User): UserOutput {
    return {
      id: user.id,
      name: user.name,
    };
  }

  async getAllUsers(): Promise<UserOutput[]> {
    const users = await this.userService.getAllUsers();
    return users.map((user) => this.#mapDomainToOutput(user));
  }

  async getUserById(id: string): Promise<UserOutput> {
    const validatedInput = userIdSchema.parse({ id });
    const user = await this.userService.getUserById(validatedInput.id);
    return this.#mapDomainToOutput(user);
  }

  async getUserByIdOrNull(id: string): Promise<UserOutput | null> {
    const validatedInput = userIdSchema.parse({ id });
    const user = await this.userService.getUserByIdOrNull(validatedInput.id);
    return user ? this.#mapDomainToOutput(user) : null;
  }

  async createUser(input: unknown): Promise<UserOutput> {
    const validatedInput = createUserSchema.parse(input);
    const completeUser: User = {
      id: uuidv4(),
      name: validatedInput.name,
    };
    const user = await this.userService.createUser(completeUser);
    return this.#mapDomainToOutput(user);
  }

  async updateUser(id: string, input: unknown): Promise<UserOutput> {
    const validatedId = userIdSchema.parse({ id });
    const validatedInput = updateUserSchema.parse(input);
    const domainData = this.#mapUpdateInputToDomain(validatedInput);
    const user = await this.userService.updateUser(validatedId.id, domainData);
    return this.#mapDomainToOutput(user);
  }

  async deleteUser(id: string): Promise<void> {
    const validatedInput = userIdSchema.parse({ id });
    await this.userService.deleteUser(validatedInput.id);
  }

  async userExists(id: string): Promise<boolean> {
    const validatedInput = userIdSchema.parse({ id });
    return await this.userService.userExists(validatedInput.id);
  }
}

