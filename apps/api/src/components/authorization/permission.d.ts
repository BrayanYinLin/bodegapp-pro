import { NextFunction, Request, Response } from 'express'
import { ResponsePermissionDto } from './entities/dtos/permission.dto'

export interface PermissionService {
  findAll(): Promise<ResponsePermissionDto[]>
}

export interface PermissionController {
  findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}
