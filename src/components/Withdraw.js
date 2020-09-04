import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

import UniBalance from './UniBalance';

const useStyles = makeStyles((theme) => ({
  contentWrap: {
    padding: 16
  },
  mutedText: {
    color: theme.palette.text.disabled
  },
  bigBalance: {
    marginTop: theme.spacing(1),
    fontSize: '1.5rem',
    fontWeight: 'bold'
  }
}));

const Withdraw = props => {
  const { web3, address, connected, staked, balance, handleAlert } = props;

  const classes = useStyles();

  return (
    <div>
      <Alert severity="info">Withdraw all of your staked UNI-V2 and claim any pending rewards.</Alert>
      <div className={classes.contentWrap}>
        <UniBalance balance={balance} connected={connected} />
        <div>
          <div className={classes.mutedText}>Amount available to withdraw</div>
          <div className={classes.bigBalance}>{staked}</div>
        </div>
      </div>
      {!connected ? (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      ) : (
        <Button variant="contained" color="primary" fullWidth>Withdraw</Button>
      )}
    </div>
  );
};

export default Withdraw;
