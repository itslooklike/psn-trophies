import { useEffect, useState } from 'react'

import { NAME_TROPHY_HIDDEN, NAME_TROPHY_DLC } from 'src/utils/config'
import { localStore } from 'src/utils/localStore'

export const useTogglers = () => {
  const [showHidden, showHiddenSet] = useState(localStore(NAME_TROPHY_HIDDEN))
  const [hideDlc, hideDlcSet] = useState(localStore(NAME_TROPHY_DLC))

  useEffect(() => {
    const hiddenState = localStore(NAME_TROPHY_HIDDEN)
    const dlcState = localStore(NAME_TROPHY_DLC)

    if (hiddenState !== showHidden) {
      showHiddenSet(hiddenState)
    }

    if (hideDlc !== dlcState) {
      hideDlcSet(dlcState)
    }
  }, [hideDlc, showHidden])

  return {
    showHidden,
    showHiddenSet,
    hideDlc,
    hideDlcSet,
  }
}
