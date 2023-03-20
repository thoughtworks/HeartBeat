import React, { useState } from 'react'
import { FlagCardItem, ItemCheckbox, ItemText } from '@src/components/Metrics/MetricsStep/CycleTime/style'

const FlagCard = () => {
  const [flagCardAsBlock, setFlagCardAsBlock] = useState(true)

  const handleFlagCardAsBlock = () => {
    setFlagCardAsBlock(!flagCardAsBlock)
  }

  return (
    <FlagCardItem onClick={handleFlagCardAsBlock}>
      <ItemCheckbox checked={flagCardAsBlock} />
      <ItemText>Consider the &quot;Flag&quot; as &quot;Block&quot;</ItemText>
    </FlagCardItem>
  )
}

export default FlagCard
