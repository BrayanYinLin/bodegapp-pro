import { decodeAccess } from '@inventories/lib/decode-access'
import { InvitationController } from '@invitations/invitation'
import { InvitationServiceImpl } from '@invitations/services/invitation.service'
import { decodeUser } from '@shared/utils/decode-user'
import { Request, Response, NextFunction } from 'express'

class InvitationCtrl implements InvitationController {
  constructor(private readonly service = new InvitationServiceImpl()) {}

  async findAllByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const sub = decodeUser(req.cookies.access_token)
      const invitations = await this.service.findAllByUser({ sub })

      return res.json(invitations)
    } catch (e) {
      next(e)
    }
  }
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { inventoryId } = req.params
      const { userId, roleId } = req.body
      const { member } = decodeAccess(req.cookies.access_inventory)
      await this.service.create({
        userId: userId,
        memberId: member.id,
        inventoryId: inventoryId,
        roleId: roleId
      })

      return res.status(201).json({ message: 'Invitation created' })
    } catch (e) {
      next(e)
    }
  }

  async accept(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { invitationId } = req.body
      await this.service.accept({ invitationId })

      return res.status(204).end()
    } catch (e) {
      next(e)
    }
  }

  async reject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { invitationId } = req.body
      await this.service.reject({ invitationId })

      return res.status(204).end()
    } catch (e) {
      next(e)
    }
  }
}

export { InvitationCtrl }
