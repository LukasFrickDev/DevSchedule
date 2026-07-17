import { useCallback, useState } from 'react'

import { adminApi } from '../../api/admin/adminApi'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'
import {
  AdminBadge,
  Brand,
  BrandLogo,
  ClientLink,
  Header,
  HeaderActions,
  LogoutButton,
  Main,
  Shell,
} from './styles'

const adminAccessKey = 'devschedule_admin_access'
const adminRefreshKey = 'devschedule_admin_refresh'

export function AdminFlow() {
  const [access, setAccess] = useState<string | null>(() =>
    window.sessionStorage.getItem(adminAccessKey),
  )

  const clearAuthentication = useCallback(() => {
    window.sessionStorage.removeItem(adminAccessKey)
    window.sessionStorage.removeItem(adminRefreshKey)
    setAccess(null)
  }, [])

  const authenticate = useCallback(
    async (username: string, password: string) => {
      try {
        const tokens = await adminApi.login(username, password)
        window.sessionStorage.setItem(adminAccessKey, tokens.access)
        window.sessionStorage.setItem(adminRefreshKey, tokens.refresh)
        setAccess(tokens.access)
        return true
      } catch {
        return false
      }
    },
    [],
  )

  return (
    <Main>
      <Shell>
        <Header>
          <Brand>
            <BrandLogo src="/logo-devschedule-png.png" alt="" />
            DevSchedule
          </Brand>
          <AdminBadge>Administração</AdminBadge>
          <HeaderActions>
            {access && (
              <LogoutButton type="button" onClick={clearAuthentication}>
                Sair
              </LogoutButton>
            )}
            <ClientLink to="/">Área do cliente</ClientLink>
          </HeaderActions>
        </Header>
        {access ? (
          <AdminDashboard
            token={access}
            onAuthenticationFailed={clearAuthentication}
          />
        ) : (
          <AdminLogin onSubmit={authenticate} />
        )}
      </Shell>
    </Main>
  )
}
