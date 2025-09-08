// import { useActionState } from 'react'

export function RegisterForm() {
  // const [state, action] = useActionState((prev, form) => {
  //   console.log(form.get('email'))
  // }, null)

  return (
    <form className="bg-white p-6 rounded-lg">
      <h1>Crear Cuenta</h1>
      <input type="email" name="email" id="email" />
      <button type="submit">Enviar</button>
    </form>
  )
}
