import { type FormEvent, useState } from 'react'

import {

  ErrorMessage,
  Field,
  Form,
  Input,
  LoginCard,
  LoginHeader,
  SubmitButton,
} from './styles'

type AdminLoginProps = {
  onSubmit: (username: string, password: string) => Promise<boolean>
}

export function AdminLogin({ onSubmit }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    username?: string
    password?: string
    credentials?: string
  }>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const validationErrors: typeof errors = {}
    if (!username.trim()) validationErrors.username = 'Informe o usuário.'
    if (!password) validationErrors.password = 'Informe a senha.'
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    const valid = await onSubmit(username.trim(), password)
    if (!valid) {
      setErrors({ credentials: 'Usuário ou senha inválidos.' })
      setSubmitting(false)
    }
  }

  return (
    <LoginCard aria-labelledby="admin-login-title">
      <LoginHeader>
        <p>Acesso administrativo</p>
        <h1 id="admin-login-title">Gerencie a agenda do DevSchedule</h1>
        <span>
          Entre com as credenciais de demonstração para acessar o painel.
        </span>
      </LoginHeader>
      <Form onSubmit={handleSubmit} noValidate>
        <Field>
          <label htmlFor="admin-username">Usuário</label>
          <Input
            id="admin-username"
            name="username"
            autoComplete="username"
            value={username}
            aria-invalid={Boolean(errors.username || errors.credentials)}
            aria-describedby={errors.username ? 'username-error' : undefined}
            onChange={(event) => setUsername(event.target.value)}
          />
          {errors.username && (
            <ErrorMessage id="username-error">{errors.username}</ErrorMessage>
          )}
        </Field>
        <Field>
          <label htmlFor="admin-password">Senha</label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            aria-invalid={Boolean(errors.password || errors.credentials)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && (
            <ErrorMessage id="password-error">{errors.password}</ErrorMessage>
          )}
        </Field>
        {errors.credentials && (
          <ErrorMessage role="alert">{errors.credentials}</ErrorMessage>
        )}
        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar no painel'}
        </SubmitButton>
      </Form>
    </LoginCard>
  )
}
