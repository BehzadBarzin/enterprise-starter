import { Permission, Role, User } from '@prisma/client';

import { prisma } from '../../utils/prisma';
import { EProviders } from '../enums/providers.enum';

import { generateHash } from './password';

export async function seedAuthDB(): Promise<void> {
  // ---------------------------------------------------------------------------
  // Find or Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: {
      name: 'super-admin',
    },
    update: {},
    create: {
      name: 'super-admin',
      description: 'Super Admin Role',
    },
    include: {
      permissions: true,
    },
  });

  const authenticatedRole = await prisma.role.upsert({
    where: {
      name: 'authenticated',
    },
    update: {},
    create: {
      name: 'authenticated',
      description: 'Authenticated User Role',
    },
    include: {
      permissions: true,
    },
  });

  // ---------------------------------------------------------------------------
  // Find or Create Super Admin User
  const superAdminUser = await prisma.user.upsert({
    where: {
      email: process.env.SUPER_ADMIN_EMAIL!,
    },
    update: {},
    create: {
      email: process.env.SUPER_ADMIN_EMAIL!,
      password: await generateHash(process.env.SUPER_ADMIN_PASSWORD!),
      provider: EProviders.local,
      roles: {
        connect: [
          {
            id: superAdminRole.id,
          },
          {
            id: authenticatedRole.id,
          },
        ],
      },
    },
  });

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Add all permissions to the super-admin role
  const permissions: Permission[] = await prisma.permission.findMany();

  for (const permission of permissions) {
    // If permission → role doesn't exist, add it
    const hasPermission: boolean = superAdminRole.permissions.some((p) => p.action === permission.action) || false;

    if (!hasPermission) {
      await prisma.role.update({
        where: {
          id: superAdminRole.id,
        },
        data: {
          permissions: {
            connect: {
              id: permission.id,
            },
          },
        },
      });
    }
  }
  // ---------------------------------------------------------------------------
}

// =============================================================================
