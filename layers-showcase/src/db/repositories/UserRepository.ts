import type { UpdateUserData, User } from '@/domain/models/User';
import { eq } from 'drizzle-orm';
import type { DbClient } from '../client';
import { users, type DrizzleUser, type DrizzleUserInsert } from '../schema';

export class UserRepository {
  constructor(private readonly dbClient: DbClient) {}

  private toDomain(drizzleUser: DrizzleUser): User {
    return {
      id: drizzleUser.id,
      name: drizzleUser.name,
    };
  }

  private toInsertModel(user: User): DrizzleUserInsert {
    return {
      id: user.id,
      name: user.name,
    };
  }

  async findAll(): Promise<User[]> {
    const drizzleUsers = await this.dbClient.select().from(users);
    return drizzleUsers.map((user) => this.toDomain(user));
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.dbClient
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async create(user: User): Promise<User> {
    const insertModel = this.toInsertModel(user);
    const result = await this.dbClient.insert(users).values(insertModel).returning();
    return this.toDomain(result[0]);
  }

  async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    const result = await this.dbClient
      .update(users)
      .set({ name: updateData.name })
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) {
      return null;
    }

    return this.toDomain(result[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.dbClient
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return result.length > 0;
  }
}

