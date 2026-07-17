import { Link } from 'react-router-dom'

import { Action, Card, Description, Eyebrow, Main, Title } from './styles'

type PageShellProps = {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  actionTo: string
}

export function PageShell({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
}: PageShellProps) {
  return (
    <Main>
      <Card>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Action as={Link} to={actionTo}>
          {actionLabel}
        </Action>
      </Card>
    </Main>
  )
}
