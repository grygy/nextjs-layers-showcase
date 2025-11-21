import type { UserRepository } from '@/db/repositories/UserRepository';
import type { UpdateUserData, User } from '../models/User';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }

  async getUserByIdOrNull(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepository.create(user);
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const updatedUser = await this.userRepository.update(id, data);
    
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    
    if (!deleted) {
      throw new Error(`User with id ${id} not found`);
    }
  }

  async userExists(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    return user !== null;
  }
}

