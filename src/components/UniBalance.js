import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
  const { connected, balance } = props;
  
  const classes = useStyles();

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
