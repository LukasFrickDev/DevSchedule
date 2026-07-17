import { useEffect, useId, useRef } from 'react'

import {
  DialogActions,
  DialogCard,
  DialogDescription,
  DialogTitle,
  Overlay,
} from './styles'

type ConfirmDialogProps = {
  kind: 'cancel' | 'delete'
  customerName: string
  submitting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  kind,
  customerName,
  submitting,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    closeButtonRef.current?.focus()

    return () => previousFocusRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !submitting) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, submitting])

  const isDelete = kind === 'delete'

  return (
    <Overlay>
      <DialogCard
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <DialogTitle id={titleId}>
          {isDelete ? 'Excluir agendamento?' : 'Cancelar agendamento?'}
        </DialogTitle>
        <DialogDescription id={descriptionId}>
          {isDelete ? (
            <>
              O agendamento de <strong>{customerName}</strong> será removido
              permanentemente. Esta ação não pode ser desfeita.
            </>
          ) : (
            <>
              O agendamento de <strong>{customerName}</strong> será cancelado,
              mas o registro continuará no histórico. O horário ficará
              disponível novamente.
            </>
          )}
        </DialogDescription>
        <DialogActions>
          <button
            ref={closeButtonRef}
            type="button"
            disabled={submitting}
            onClick={onClose}
          >
            {isDelete ? 'Manter registro' : 'Manter agendamento'}
          </button>
          <button
            type="button"
            data-danger={isDelete || undefined}
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting
              ? 'Aguarde…'
              : isDelete
                ? 'Excluir permanentemente'
                : 'Confirmar cancelamento'}
          </button>
        </DialogActions>
      </DialogCard>
    </Overlay>
  )
}
