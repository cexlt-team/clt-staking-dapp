import React, { useEffect } from 'react';
import { createIcon } from '@download/blockies';

const Blockies = props => {
  const { address, size } = props;

  useEffect(() => {
    const icon = createIcon({
      seed: address,
      size,
      scale: 4
    });
    
    document.getElementById('blockies').appendChild(icon)
  }, [address, size])

  return (
    <div id="blockies"></div>
  )
};

export default Blockies;