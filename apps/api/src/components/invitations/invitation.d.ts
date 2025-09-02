import { NextFunction, Request, Response } from 'express'
import {
  CreateInvitationDto,
  InvitationIdDto,
  ResponseInvitationDto
} from './entities/dtos/invitation.dto'

export type FindByUserDto = {
  sub: string
}

export interface InvitationService {
  create(dto: CreateInvitationDto): Promise<void>
  findAllByUser({ sub }: FindByUserDto): Promise<ResponseInvitationDto[]>
  accept({ id }: InvitationIdDto): Promise<void>
  reject({ id }: InvitationIdDto): Promise<void>
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
  accept(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
  reject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>
}
