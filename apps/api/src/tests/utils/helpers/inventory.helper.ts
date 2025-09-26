import {
  CreateInventoryDto,
  ResponseInventoryDto
} from '@inventories/entities/dtos/inventory.dto'
import { ROUTES } from '@shared/config/constants'
import request from 'supertest'

export type SetupInventoryOptions = {
  inventory: CreateInventoryDto
  agent: ReturnType<typeof request.agent>
}

export const setupInventory = async ({
  inventory,
  agent
}: SetupInventoryOptions): Promise<ResponseInventoryDto> => {
  const { body } = await agent.post(ROUTES.INVENTORY).send(inventory)

  return body
}
