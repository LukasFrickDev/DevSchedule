import { useState } from 'react'

import { getAdminFixtureScenario } from '../../api/admin/fixtureAdminApi'
import { AdminDashboard } from './AdminDashboard'
import { AdminLogin } from './AdminLogin'
import { AdminBadge, Brand, ClientLink, Header, Main, Shell } from './styles'

const credentials = {
  username: 'admin',
  password: 'devschedule',
}

export function AdminFlow() {
  const [scenario] = useState(getAdminFixtureScenario)
  const [authenticated, setAuthenticated] = useState(false)

  async function authenticate(username: string, password: string) {
    await new Promise<void>((resolve) =>
      window.setTimeout(resolve, import.meta.env.MODE === 'test' ? 0 : 500),
    )
    const valid =
      username === credentials.username && password === credentials.password
    if (valid) setAuthenticated(true)
    return valid
  }

  return (
    <Main>
      <Shell>
        <Header>
          <Brand>DevSchedule</Brand>
          <AdminBadge>Administração</AdminBadge>
          <ClientLink to="/">Área do cliente</ClientLink>
        </Header>
        {authenticated ? (
          <AdminDashboard scenario={scenario} />
        ) : (
          <AdminLogin onSubmit={authenticate} />
        )}
      </Shell>
    </Main>
  )
}
