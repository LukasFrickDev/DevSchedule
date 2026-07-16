import { SchedulingFlow } from '../features/client-scheduling/SchedulingFlow'
import { useSchedulingFlow } from '../features/client-scheduling/useSchedulingFlow'

export function ClientHome() {
  const flow = useSchedulingFlow()

  return <SchedulingFlow flow={flow} />
}
