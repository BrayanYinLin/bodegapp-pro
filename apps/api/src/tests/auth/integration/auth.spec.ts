import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@root/main'

describe('Authentication Integration Tests', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/auth/v1/register').send({
      username: 'testuser',
      password: 'testpassword',
      email: ''
    })

    expect(response.status).toBe(201)
  })
})
