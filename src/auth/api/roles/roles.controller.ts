import { Request, RequestHandler, Response } from 'express';

import { IdParamsDTO } from '../../../common/dtos/id-params.dto';
import { validateBody } from '../../../middlewares/validate-body.middleware';
import { validateParams } from '../../../middlewares/validate-params.middleware';

import { CreateRoleBodyDTO } from './dtos/create-role-body.dto';
import { UpdateRoleBodyDTO } from './dtos/update-role-body.dto';
import RolesService from './roles.service';

class RolesController {
  // -------------------------------------------------------------------------
  private rolesService: RolesService;

  constructor() {
    this.rolesService = new RolesService();
  }

  // ---------------------------------------------------------------------------
  getAllRoles: RequestHandler[] = [
    async (req: Request, res: Response) => {
      const roles = await this.rolesService.getAllRoles();

      res.json(roles);
    },
  ];

  // ---------------------------------------------------------------------------
  getRoleById: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const role = await this.rolesService.getRoleById(parseInt(id, 10));

      res.json(role);
    },
  ];

  // ---------------------------------------------------------------------------
  createRole: RequestHandler[] = [
    // Validate body
    validateBody(CreateRoleBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const newRole = await this.rolesService.createRole(req.body);

      res.status(201).json(newRole);
    },
  ];

  // ---------------------------------------------------------------------------
  updateRole: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Validate body
    validateBody(UpdateRoleBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const updatedRole = await this.rolesService.updateRole(parseInt(id, 10), req.body);
      res.json(updatedRole);
    },
  ];

  // ---------------------------------------------------------------------------
  deleteRole: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const deletedRole = await this.rolesService.deleteRole(parseInt(id, 10));

      res.json(deletedRole);
    },
  ];

  // ---------------------------------------------------------------------------
}

export default RolesController;
