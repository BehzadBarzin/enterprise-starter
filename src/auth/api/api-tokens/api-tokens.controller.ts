import { Request, RequestHandler, Response } from 'express';

import { IdParamsDTO } from '../../../common/dtos/id-params.dto';
import { validateBody } from '../../../middlewares/validate-body.middleware';
import { validateParams } from '../../../middlewares/validate-params.middleware';

import ApiTokensService from './api-tokens.service';
import { IssueTokenBodyDTO } from './dtos/issue-token-body.dto';

class ApiTokensController {
  // ---------------------------------------------------------------------------
  private apiTokensService: ApiTokensService;

  constructor() {
    this.apiTokensService = new ApiTokensService();
  }

  // ---------------------------------------------------------------------------
  getAllApiTokensOfUser: RequestHandler[] = [
    async (req: Request, res: Response) => {
      const apiTokens = await this.apiTokensService.getAllApiTokensOfUser(req.userId!);

      res.json(apiTokens);
    },
  ];

  // ---------------------------------------------------------------------------
  getApiTokenById: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const apiToken = await this.apiTokensService.getApiTokenById(parseInt(id, 10));

      res.json(apiToken);
    },
  ];

  // ---------------------------------------------------------------------------
  issueToken: RequestHandler[] = [
    // Validate body
    validateBody(IssueTokenBodyDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const apiToken = await this.apiTokensService.issueToken(req.userId!, req.body);

      res.status(201).json(apiToken);
    },
  ];

  // ---------------------------------------------------------------------------
  revokeToken: RequestHandler[] = [
    // Validate :id param
    validateParams(IdParamsDTO),
    // Main handler
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const apiToken = await this.apiTokensService.revokeToken(parseInt(id, 10));

      res.json(apiToken);
    },
  ];

  // ---------------------------------------------------------------------------
}

export default ApiTokensController;
