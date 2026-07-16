import type { FormEvent } from 'react'

import type { SchedulingFlowController } from '../../../hooks/useSchedulingFlow'
import { FlowPanel } from '../FlowPanel'
import { Actions, Button, ErrorText, FormGroup, Input, Label } from '../styles'
import { CustomerForm } from './styles'

export function CustomerDataStep({ flow }: { flow: SchedulingFlowController }) {
  function submit(event: FormEvent) {
    event.preventDefault()
    flow.continueFromDetails()
  }

  return (
    <FlowPanel
      stepNumber="Etapa 3 de 4"
      title="Só falta conhecer você."
      lead="Seus dados serão usados apenas para identificar este agendamento."
    >
      <CustomerForm noValidate onSubmit={submit}>
        <FormGroup>
          <Label htmlFor="customer-name">Nome completo</Label>
          <Input
            id="customer-name"
            name="name"
            autoComplete="name"
            value={flow.name}
            $invalid={Boolean(flow.fieldErrors.name)}
            aria-invalid={Boolean(flow.fieldErrors.name)}
            aria-describedby={flow.fieldErrors.name ? 'name-error' : undefined}
            onChange={(event) => flow.setName(event.target.value)}
          />
          {flow.fieldErrors.name && (
            <ErrorText id="name-error" role="alert">
              {flow.fieldErrors.name}
            </ErrorText>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="customer-phone">Telefone com DDD</Label>
          <Input
            id="customer-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            value={flow.phone}
            $invalid={Boolean(flow.fieldErrors.phone)}
            aria-invalid={Boolean(flow.fieldErrors.phone)}
            aria-describedby={
              flow.fieldErrors.phone ? 'phone-error' : undefined
            }
            onChange={(event) => flow.setPhone(event.target.value)}
          />
          {flow.fieldErrors.phone && (
            <ErrorText id="phone-error" role="alert">
              {flow.fieldErrors.phone}
            </ErrorText>
          )}
        </FormGroup>
        <Actions>
          <Button type="button" $secondary onClick={flow.goToSchedule}>
            Voltar
          </Button>
          <Button type="submit">Revisar agendamento</Button>
        </Actions>
      </CustomerForm>
    </FlowPanel>
  )
}
