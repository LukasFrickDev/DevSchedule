import 'styled-components'

import type { AppTheme } from './theme'

declare module 'styled-components' {
  // A extensão da interface é o formato exigido pela tipagem do styled-components.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
