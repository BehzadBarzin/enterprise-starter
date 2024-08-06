import { User } from '@prisma/client';

import { BadRequestError } from '../../../errors/bad-request.error';
import { NotFoundError } from '../../../errors/not-found.error';
import { prisma } from '../../../utils/prisma';
import { EProviders } from '../../enums/providers.enum';
import { generateHash } from '../../utils/password';

import { CreateUserBodyDTO } from './dtos/create-user-body.dto';
import { UpdateUserBodyDTO } from './dtos/update-user-body.dto';

export type CleanUser = Omit<User, 'password' | 'resetPasswordToken' | 'confirmationToken'>;

class UsersService {
  // ---------------------------------------------------------------------------
  async getAllUsers(): Promise<CleanUser[]> {
    const users = await prisma.user.findMany();

    return users.map((user) => this.cleanUser(user));
  }

  // ---------------------------------------------------------------------------
  async getUserById(id: number): Promise<CleanUser> {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundError('User Not Found');
    }

    return this.cleanUser(user);
  }

  // ---------------------------------------------------------------------------
  async createUser(userData: CreateUserBodyDTO): Promise<CleanUser> {
    // Check if email is already in use
    const existingUser = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    // Find the default "authenticated" role from DB
    const defaultRole = await prisma.role.findFirst({
      where: { name: 'authenticated' },
    });
    if (!defaultRole) {
      throw new Error('Default "authenticated" role not found when creating a user');
    }

    // User Role connections
    const userRoles = userData.roles?.map((roleId) => ({ id: roleId })) || [];
    // If default "authenticated" role isn't set, add it to the list
    if (!userRoles.find((role) => role.id === defaultRole.id)) {
      userRoles.push({ id: defaultRole.id });
    }
    delete userData.roles;

    // Create new User
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: await generateHash(userData.password!),
        roles: {
          connect: userRoles,
        },
        provider: EProviders.local,
      },
    });

    return this.cleanUser(newUser);
  }

  // ---------------------------------------------------------------------------
  async updateUser(id: number, userData: UpdateUserBodyDTO): Promise<CleanUser> {
    const userToUpdate = await prisma.user.findFirst({
      where: { id },
      include: { roles: { select: { id: true } } },
    });
    if (!userToUpdate) {
      throw new NotFoundError(`User Not Found`);
    }

    // Cannot update user's sensitive fields
    // if (userData.password || userData.email || userData.provider) {
    //   throw new BadRequestError("Cannot update user's sensitive fields");
    // }

    let userRoles: { id: number }[] = [];
    // If roles are being updated
    if (userData.roles) {
      // Find the default "authenticated" role from DB
      const defaultRole = await prisma.role.findFirst({
        where: { name: 'authenticated' },
      });
      if (!defaultRole) {
        throw new Error('Default "authenticated" role not found');
      }

      // If update data doesn't have the default role, throw error
      if (!userData.roles.includes(defaultRole.id)) {
        throw new BadRequestError('Default role cannot be removed');
      }

      // Update User Role connections
      userRoles = userData.roles?.map((roleId) => ({ id: roleId })) || [];
      delete userData.roles;
    }

    // Merge the existing product with the new data
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...userData,
        roles: {
          // If roles are not provided in body, keep the current roles
          set: userRoles.length ? userRoles : userToUpdate.roles,
        },
      },
    });

    return this.cleanUser(updatedUser);
  }

  // ---------------------------------------------------------------------------
  async deleteUser(id: number): Promise<CleanUser> {
    const userToDelete = await prisma.user.findFirst({ where: { id }, select: { id: true, email: true } });
    if (!userToDelete) {
      throw new NotFoundError(`User Not Found`);
    }

    // If it is the default super-admin user, throw an error
    if (userToDelete.email === process.env.SUPER_ADMIN_EMAIL!) {
      throw new BadRequestError('Cannot delete the default "super-admin" user');
    }

    const user = await prisma.user.delete({
      where: { id },
    });

    return this.cleanUser(user);
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  async getUserByEmail(email: string, includePassword: boolean = false): Promise<CleanUser | User> {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundError('User Not Found');
    }

    return includePassword ? user : this.cleanUser(user);
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  /**
   * Utility function to get User entity from DB as input and returns the user without sensitive fields.
   */
  cleanUser(user: User): CleanUser {
    return {
      id: user.id,
      email: user.email,
      provider: user.provider,
      confirmed: user.confirmed,
      blocked: user.blocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // ---------------------------------------------------------------------------
}

export default UsersService;
