import { createBrowserRouter } from 'react-router-dom'

import { AdminHome } from '../pages/AdminHome'
import { ClientHome } from '../pages/ClientHome'
import { NotFound } from '../pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientHome />,
  },
  {
    path: '/admin',
    element: <AdminHome />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
