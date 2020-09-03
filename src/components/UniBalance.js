import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { UNIV2, UNIV2_ABI } from '../lib/contracts'

const useStyles = makeStyles((theme) => ({
  connectedBalance: {
    marginBottom: 24,
    textAlign: 'right'
  },
  mutedText: {
    color: theme.palette.text.disabled
  },
  smallBalance: {
    marginRight: 8,
    marginLeft: 8,
    fontWeight: 'bold'
  },
  notConnected: {
    color: theme.palette.error.main
  }
}));

const UniBalance = props => {
  const { web3, address, connected } = props;
  
  const classes = useStyles();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (connected && web3 && address !== '') {
      const contract = new web3.eth.Contract(UNIV2_ABI, UNIV2)

      contract.methods.balanceOf(address).call().then(result => {
        const value = web3.utils.fromWei(result, 'ether')
        setBalance(value)
      }).catch(error => {
        console.log(error)
      })
    }
  }, [address, connected, web3])

  return (
    <div className={classes.connectedBalance}>
      <span className={classes.mutedText}>Your account's balance: </span>
      <span className={classes.smallBalance}>{balance}</span>
      {connected ? (
        <span>UNI-V2</span>
      ) : (
        <span className={classes.notConnected}>(Not connected)</span>
      )}
    </div>
  );
}

export default UniBalance;
