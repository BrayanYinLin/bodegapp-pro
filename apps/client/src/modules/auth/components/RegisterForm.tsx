import { type FormEvent } from 'react'
import { Lock, Mail, User } from 'lucide-react'
import { api } from '@/shared/utils/api'
import { InputAuth } from './InputAuth'
import { useForm } from '@tanstack/react-form'

interface UserForm {
  name: string
  email: string
  password: string
}

const signup = async ({ name, email, password }: UserForm) => {
  await api.post('/auth/signup', {
    name,
    email,
    password
  })
}

export function RegisterForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      await signup(value)
    }
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg flex flex-col gap-5"
    >
      <h1 className="text-xl text-accent-foreground font-bold text-center">
        Crear Cuenta
      </h1>

      <form.Field name="name">
        {(field) => (
          <InputAuth
            icon={
              <User className="absolute w-5 h-5 top-2.5 right-2.5 text-amaranth-600 stroke-[1.5px]" />
            }
            labelContent="Usuario"
            type="text"
            placeholder="John Doe"
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <InputAuth
        icon={
          <Mail className="absolute w-5 h-5 top-2.5 right-2.5 text-amaranth-600 stroke-[1.5px]" />
        }
        labelContent="Correo electronico"
        type="email"
        placeholder="jdoe@example.com"
      />

      <InputAuth
        icon={
          <Lock className="absolute w-5 h-5 top-2.5 right-2.5 text-amaranth-600 stroke-[1.5px]" />
        }
        labelContent="Contraseña"
        type="password"
        placeholder="Type a secure password"
      />
      <button
        type="submit"
        className="cursor-pointer hover:bg-amaranth-500 bg-amaranth-600 text-white font-bold rounded-md py-2"
      >
        Enviar
      </button>
    </form>
  )
}
