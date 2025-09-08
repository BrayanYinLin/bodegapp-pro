import { SignupPage } from '@/pages/Signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignupPage
})
