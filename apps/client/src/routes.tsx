import { createBrowserRouter } from 'react-router'
import { Dashboard } from './pages/Dashboard'
import { NotFoundPage } from './pages/NotFoundPage'

const routes = createBrowserRouter([
  {
    errorElement: <NotFoundPage />
  },
  {
    path: '/dashboard',
    Component: Dashboard
  }
])

export { routes }
