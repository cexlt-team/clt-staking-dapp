import React, {useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button';

import UniBalance from './UniBalance';

import { UNIPOOL_ABI, UNIPOOL } from '../lib/contracts';

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
  },
  marginTop: {
    marginTop: theme.spacing(4)
  }
}));

const Withdraw = props => {
  const { web3, address, connected, staked, balance, handleAlert, setPending, getBalance } = props;

  const [showResult, setShowResult] = useState(false);
  const [transaction, setTransaction] = useState('');

  const classes = useStyles();

  const handleWithdraw = async () => {
    if (staked === '0') {
      handleAlert('error', 'Error', 'Payment cannot be made when Staked UNI-V2 is zero');
      return false
    }

    try {
      setPending(true);

      const unipool = new web3.eth.Contract(UNIPOOL_ABI, UNIPOOL);
      await unipool.methods.exit().send({ from: address }).then(result => {
        console.log(result);

        setPending(false);
        setTransaction(result.transactionHash);
        handleAlert('info', `${staked} UNI-V2 withdrawed`);
        getBalance();
        setShowResult(true);
      }).catch(err => {
        setPending(false);
        console.log(err)
      })

    } catch (err) {
      handleAlert('error', 'Error', err.message);
      setPending(false);
    }
  }

  const handleRefresh = () => {
    setShowResult(false);
  }

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
        <Button variant="contained" color="primary" fullWidth onClick={handleWithdraw}>Withdraw</Button>
      )}
      {showResult && (
        <div>
          <div className={classes.marginTop}>
            <Alert severity="success">
              <AlertTitle>Claim Reward Transaction</AlertTitle>
              <a href={`https://ropsten.etherscan.io/tx/${transaction}`} target="_blank" rel="noopener noreferrer">
                {transaction}
              </a>
            </Alert>
          </div>
          <div className={classes.marginTop}>
            <Button variant="contained" color="secondary" fullWidth onClick={handleRefresh}>Refresh</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
