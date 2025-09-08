import { SigninPage } from '@/modules/auth/pages/Signin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
  component: SigninPage
})
