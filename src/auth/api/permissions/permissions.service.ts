import { Permission } from '@prisma/client';

import { NotFoundError } from '../../../errors/not-found.error';
import { prisma } from '../../../utils/prisma';

class PermissionsService {
  // ---------------------------------------------------------------------------
  async getAllPermissions(): Promise<Permission[]> {
    return await prisma.permission.findMany();
  }

  // ---------------------------------------------------------------------------
  async getPermissionById(id: number): Promise<Permission> {
    const permission = await prisma.permission.findFirst({ where: { id } });
    if (!permission) {
      throw new NotFoundError('Permission Not Found');
    }

    return permission;
  }

  // ---------------------------------------------------------------------------
}

export default PermissionsService;
