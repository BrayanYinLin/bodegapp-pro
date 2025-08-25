import { NextFunction, Request, Response } from 'express'
import {
  CreateInvitationDto,
  ResponseInvitationDto
} from './entities/dtos/invitation.dto'

export type FindByUserDto = {
  sub: string
}

export interface InvitationService {
  create(dto: CreateInvitationDto): Promise<void>
  findAllByUser({ sub }: FindByUserDto): Promise<ResponseInvitationDto[]>
}

export interface InvitationController {
  findAllByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}
