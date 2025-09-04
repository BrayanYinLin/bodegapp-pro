import { PermissionServiceImpl } from '@authorization/services/permission.service'
import { describe, it, expect, vi } from 'vitest'
import { PermissionControllerImpl } from './permission.controller'
import { Request, Response } from 'express'
import { PERMISSIONS } from '@shared/database/role.seed'

vi.mock('@authorization/services/permission.service')

describe('Permission controller tests', async () => {
  const mockService: Partial<PermissionServiceImpl> = {
    findAll: vi.fn()
  }
  const controller = new PermissionControllerImpl(
    mockService as PermissionServiceImpl
  )
  const mockResponse: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  }
  const mockRequest: Partial<Request> = {}

  const mockNext = vi.fn()

  it('return all permissions', async () => {
    const permissions = Object.values(PERMISSIONS).map((val) => ({
      id: crypto.randomUUID(),
      description: val
    }))
    vi.mocked(mockService.findAll!).mockResolvedValue(permissions)

    await controller.findAll(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )
    expect(mockService.findAll).toHaveBeenCalled()
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith(permissions)
  })
})
