import { Request, RequestHandler, Response } from 'express';

import { IdParamsDTO } from '../../../common/dtos/id-params.dto';
import { validateParams } from '../../../middlewares/validate-params.middleware';
import { Authorize } from '../../decorators/authorize.decorator';

import PermissionsService from './permissions.service';

class PermissionsController {
  // -------------------------------------------------------------------------
  private permissionsService: PermissionsService;

  constructor() {
    this.permissionsService = new PermissionsService();
  }

  // ---------------------------------------------------------------------------
  @Authorize('permissions.getAllPermissions')
  getAllPermissions: RequestHandler[] = [
    async (req: Request, res: Response) => {
      const permissions = await this.permissionsService.getAllPermissions();

      res.json(permissions);
    },
  ];

  // ---------------------------------------------------------------------------
  @Authorize('permissions.getPermissionById')
  getPermissionById: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const permission = await this.permissionsService.getPermissionById(parseInt(id, 10));

      res.json(permission);
    },
  ];

  // ---------------------------------------------------------------------------
}

export default PermissionsController;
