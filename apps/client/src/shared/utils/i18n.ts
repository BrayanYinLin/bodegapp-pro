import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      signupMessage: '¡Hello, welcome!',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      signup: 'Sign up'
    }
  },
  es: {
    translation: {
      signupMessage: '¡Hola, Bienvenido!',
      name: 'Nombre',
      email: 'Correo',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      signup: 'Registrarse'
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export { i18n }
