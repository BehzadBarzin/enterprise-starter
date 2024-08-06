import { Role } from '@prisma/client';

import { NotFoundError } from '../../../errors/not-found.error';
import { prisma } from '../../../utils/prisma';

import { CreateRoleBodyDTO } from './dtos/create-role-body.dto';
import { UpdateRoleBodyDTO } from './dtos/update-role-body.dto';

class RolesService {
  // ---------------------------------------------------------------------------
  async getAllRoles(): Promise<Role[]> {
    return await prisma.role.findMany();
  }

  // ---------------------------------------------------------------------------
  async getRoleById(id: number): Promise<Role> {
    const role = await prisma.role.findFirst({ where: { id } });
    if (!role) {
      throw new NotFoundError('Role Not Found');
    }

    return role;
  }

  // ---------------------------------------------------------------------------
  async createRole(roleData: CreateRoleBodyDTO): Promise<Role> {
    const rolePermissions: { id: number }[] = roleData.permissions?.map((permissionId) => ({ id: permissionId })) || [];
    delete roleData.permissions;

    const newRole = await prisma.role.create({
      data: {
        ...roleData,
        permissions: {
          connect: rolePermissions,
        },
      },
    });
    return newRole;
  }

  // ---------------------------------------------------------------------------
  async updateRole(id: number, roleData: UpdateRoleBodyDTO): Promise<Role> {
    const roleToUpdate = await prisma.role.findFirst({
      where: { id },
      include: { permissions: { select: { id: true } } },
    });
    if (!roleToUpdate) {
      throw new NotFoundError(`Role Not Found`);
    }

    // Start by using existing permissions
    let rolePermissions: { id: number }[] = roleToUpdate.permissions;
    // If permissions are being updated
    if (roleData.permissions) {
      // Override Role Permission connections
      rolePermissions = roleData.permissions.map((permissionId) => ({ id: permissionId }));
      delete roleData.permissions;
    }

    // Merge the existing role with the new data
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        permissions: {
          set: rolePermissions,
        },
      },
    });

    return updatedRole;
  }

  // ---------------------------------------------------------------------------

  async deleteRole(id: number): Promise<Role> {
    const roleToDelete = await prisma.role.findFirst({ where: { id }, select: { id: true } });
    if (!roleToDelete) {
      throw new NotFoundError('Role Not Found');
    }

    return await prisma.role.delete({
      where: { id },
    });
  }

  // ---------------------------------------------------------------------------
}

export default RolesService;
