import { useEffect, useState } from 'react'

import { NAME_TROPHY_HIDDEN, NAME_TROPHY_DLC } from 'src/utils/constants'
import { getUiState } from 'src/utils/getUiState'

export const useTogglers = () => {
  const [showHidden, showHiddenSet] = useState(getUiState(NAME_TROPHY_HIDDEN))
  const [hideDlc, hideDlcSet] = useState(getUiState(NAME_TROPHY_DLC))

  useEffect(() => {
    const hiddenState = getUiState(NAME_TROPHY_HIDDEN)
    const dlcState = getUiState(NAME_TROPHY_DLC)

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
