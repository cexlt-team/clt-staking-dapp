import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

import UniBalance from './UniBalance';

const useStyles = makeStyles((theme) => ({
  contentWrap: {
    padding: 16
  },
  bigBalance: {
    marginTop: 8,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }
}));

const Stake = props => {
  const { web3, address, connected, staked } = props;

  const classes = useStyles();

  return (
    <div>
      <Alert severity="info">Learn how to obtain UNI-V2 to participate in the rewards program</Alert>
      <div className={classes.contentWrap}>
        <UniBalance connected={connected} address={address} web3={web3} />
        <Input
          disabled={!connected}
          fullWidth
        />
      </div>
      {!connected ? (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      ) : (
        <Button variant="contained" color="primary" fullWidth>Stake</Button>
      )}
    </div>
  );
};

export default Stake;
