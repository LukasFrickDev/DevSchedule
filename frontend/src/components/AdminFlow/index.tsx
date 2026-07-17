import { useCallback, useState } from 'react'

import { adminApi } from '../../api/admin/adminApi'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'
import { AdminBadge, Brand, ClientLink, Header, Main, Shell } from './styles'

const adminTokenKey = 'devschedule_admin_token'

export function AdminFlow() {
  const [token, setToken] = useState<string | null>(() =>
    window.sessionStorage.getItem(adminTokenKey),
  )

  const clearAuthentication = useCallback(() => {
    window.sessionStorage.removeItem(adminTokenKey)
    setToken(null)
  }, [])

  const authenticate = useCallback(async (username: string, password: string) => {
    try {
      const nextToken = await adminApi.login(username, password)
      window.sessionStorage.setItem(adminTokenKey, nextToken)
      setToken(nextToken)
      return true
    } catch {
      return false
    }
  }, [])

  return (
    <Main>
      <Shell>
        <Header>
          <Brand>DevSchedule</Brand>
          <AdminBadge>Administração</AdminBadge>
          <ClientLink to="/">Área do cliente</ClientLink>
        </Header>
        {token ? (
          <AdminDashboard token={token} onAuthenticationFailed={clearAuthentication} />
        ) : (
          <AdminLogin onSubmit={authenticate} />
        )}
      </Shell>
    </Main>
  )
}
