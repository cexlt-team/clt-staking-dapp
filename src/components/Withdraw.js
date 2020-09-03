import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const tokenAddress = '0x6cdc937038b292b2d9514f03b1bd957082201246';

const tokenABI = [
  {
    constant: true,
    inputs: [{
      name: '_owner',
      type: 'address'
    }],
    name: 'balanceOf',
    outputs: [{
      name: 'balance',
      type: 'uint256'
    }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{
      name: '',
      type: 'uint8'
    }],
    type: 'function'
  }
];

const useStyles = makeStyles((theme) => ({
  contentWrap: {
    padding: 16
  },
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
  },
  bigBalance: {
    marginTop: 8,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }
}));

const Withdraw = props => {
  const classes = useStyles();

  const { connected, address, web3 } = props;

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (connected && web3 && address !== '') {
      const contract = new web3.eth.Contract(tokenABI, tokenAddress)

      contract.methods.balanceOf(address).call().then(result => {
        const value = web3.utils.fromWei(result, 'ether')
        setBalance(value)
      }).catch(error => {
        console.log(error)
      })
    }
  }, [address, connected, web3])

  return (
    <div>
      <Alert severity="info">Withdraw all of your staked UNI-V2 and claim any pending rewards.</Alert>
      <div className={classes.contentWrap}>
        <div className={classes.connectedBalance}>
          <span className={classes.mutedText}>Your account's balance: </span>
          <span className={classes.smallBalance}>{balance}</span>
          {connected ? (
            <span>UNI-V2</span>
          ) : (
            <span className={classes.notConnected}>(Not connected)</span>
          )}
        </div>
        <div>
          <div className={classes.mutedText}>Amount available to withdraw</div>
          <div className={classes.bigBalance}>{balance}</div>
        </div>
      </div>
      {!connected && (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      )}
    </div>
  );
};

export default Withdraw;
