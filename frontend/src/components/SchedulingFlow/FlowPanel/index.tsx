import type { ReactNode } from 'react'

import { Eyebrow, Lead, Panel, PanelContent, Title } from './styles'

type FlowPanelProps = {
  stepNumber: string
  title: string
  lead: string
  children: ReactNode
}

export function FlowPanel({
  stepNumber,
  title,
  lead,
  children,
}: FlowPanelProps) {
  return (
    <Panel aria-labelledby="flow-title">
      <PanelContent>
        <Eyebrow>{stepNumber}</Eyebrow>
        <Title id="flow-title">{title}</Title>
        <Lead>{lead}</Lead>
        {children}
      </PanelContent>
    </Panel>
  )
}
