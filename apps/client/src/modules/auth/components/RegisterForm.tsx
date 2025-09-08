// import { useActionState } from 'react'

import { Mail } from 'lucide-react'

export function RegisterForm() {
  // const [state, action] = useActionState((prev, form) => {
  //   console.log(form.get('email'))
  // }, null)

  return (
    <form className="bg-white p-6 rounded-lg">
      <h1>Crear Cuenta</h1>
      <div className="w-full max-w-sm min-w-[280px]">
        <div className="relative">
          <Mail className="absolute w-5 h-5 top-2.5 right-2.5 text-amaranth-600" />
          <input
            type="text"
            className="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Type here..."
          />
        </div>
      </div>
      <button type="submit">Enviar</button>
    </form>
  )
}
