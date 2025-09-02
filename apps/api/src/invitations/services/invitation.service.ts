import {
  CreateInvitationDto,
  ResponseInvitationDto,
  InvitationIdDto,
  ResponseInvitationSchema
} from '@invitations/entities/dtos/invitation.dto'
import {
  Invitation,
  InvitationStatus
} from '@invitations/entities/invitation.entity'
import { FindByUserDto, InvitationService } from '@invitations/invitation'
import { Member } from '@members/entities/member.entity'
import { ERROR_HTTP_CODES, ERROR_NAMES } from '@shared/config/constants'
import { AppDataSource } from '@shared/database/data-source'
import { PERMISSIONS } from '@shared/database/role.seed'
import { AppError } from '@shared/utils/error-factory'

class InvitationServiceImpl implements InvitationService {
  constructor(
    private readonly repository = AppDataSource.getRepository(Invitation),
    private readonly memberRepository = AppDataSource.getRepository(Member)
  ) {}

  async findAllByUser({
    sub
  }: FindByUserDto): Promise<ResponseInvitationDto[]> {
    const invitations = await this.repository.find({
      where: {
        userInvited: {
          id: sub
        }
      },
      relations: ['invitedBy', 'invitedBy.user', 'inventory']
    })

    const invitationsMapped = invitations.map((invitation) => {
      const { success, data, error } =
        ResponseInvitationSchema.safeParse(invitation)

      if (!success || error) {
        throw new AppError({
          code: ERROR_NAMES.VALIDATION,
          httpCode: ERROR_HTTP_CODES.VALIDATION,
          message: 'Invitation validation failed.',
          isOperational: true
        })
      }

      return data
    })

    return invitationsMapped
  }

  async create({
    userId,
    inventoryId,
    memberId,
    roleId
  }: CreateInvitationDto): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId
      },
      relations: ['role', 'role.permissions']
    })

    if (!member) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'User not found.',
        isOperational: true
      })
    }

    const { permissions } = member.role

    const hasPermission = permissions.findIndex(
      ({ description }) => PERMISSIONS.CREATE_INVITATION === description
    )

    if (hasPermission === -1) {
      throw new AppError({
        code: ERROR_NAMES.FORBIDDEN,
        httpCode: ERROR_HTTP_CODES.FORBIDDEN,
        message: 'Permission not granted.',
        isOperational: true
      })
    }

    await this.repository.save({
      invitedBy: {
        id: memberId
      },
      userInvited: {
        id: userId
      },
      inventory: {
        id: inventoryId
      },
      role: {
        id: roleId
      },
      status: InvitationStatus.PENDING
    })
  }

  async accept({ invitationId }: InvitationIdDto): Promise<void> {
    const invitation = await this.repository.findOne({
      where: {
        id: invitationId
      },
      relations: ['userInvited', 'invitedBy', 'inventory', 'role']
    })

    if (!invitation) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'Invitation not found.',
        isOperational: true
      })
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new AppError({
        code: ERROR_NAMES.CONFLICT,
        httpCode: ERROR_HTTP_CODES.CONFLICT,
        message: 'Invitation has been replied.',
        isOperational: true
      })
    }

    await this.repository
      .createQueryBuilder()
      .update(Invitation)
      .set({ status: InvitationStatus.ACCEPTED })
      .where('id = :id', { id: invitation.id })
      .execute()

    await this.memberRepository.save({
      user: invitation.userInvited,
      inventory: invitation.inventory,
      role: invitation.role
    })
  }

  async reject({ invitationId }: InvitationIdDto): Promise<void> {
    const invitation = await this.repository.findOne({
      where: {
        id: invitationId
      },
      relations: ['userInvited', 'invitedBy', 'inventory', 'role']
    })

    if (!invitation) {
      throw new AppError({
        code: ERROR_NAMES.NOT_FOUND,
        httpCode: ERROR_HTTP_CODES.NOT_FOUND,
        message: 'Invitation not found.',
        isOperational: true
      })
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new AppError({
        code: ERROR_NAMES.CONFLICT,
        httpCode: ERROR_HTTP_CODES.CONFLICT,
        message: 'Invitation has been replied.',
        isOperational: true
      })
    }

    await this.repository
      .createQueryBuilder()
      .update(Invitation)
      .set({ status: InvitationStatus.REJECTED })
      .where('id = :id', { id: invitation.id })
      .execute()

    await this.memberRepository.save({
      user: invitation.userInvited,
      inventory: invitation.inventory,
      role: invitation.role
    })
  }
}

export { InvitationServiceImpl }
