import { Permission } from '@prisma/client';

import { prisma } from '../../utils/prisma';

export async function registerAction(action: string, description: string): Promise<Permission> {
  const existingPermission = await prisma.permission.findFirst({
    where: {
      action,
    },
  });

  if (existingPermission) {
    return existingPermission;
  }

  const newPermission = await prisma.permission.create({
    data: {
      action,
      description,
    },
  });

  return newPermission;
}
