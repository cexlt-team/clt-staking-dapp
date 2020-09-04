import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button';

import UniBalance from './UniBalance';

import { UNIPOOL, UNIPOOL_ABI, UNIV2, UNIV2_ABI } from '../lib/contracts';

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

const Stake = props => {
  const { web3, address, connected, staked, balance, handleAlert, getBalance, setPending } = props;

  const [amount, setAmount] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [transaction, setTransaction] = useState('');

  const classes = useStyles();

  const setAllowance = async () => {
    const unitoken = new web3.eth.Contract(UNIV2_ABI, UNIV2);
    
    try {
      const allowance = await unitoken.methods.allowance(address, UNIPOOL).call();
      return allowance;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  const setApprove = async () => {
    const unitoken = new web3.eth.Contract(UNIV2_ABI, UNIV2);

    const allowance = await setAllowance();
    const newAmount = web3.utils.toWei(amount, 'ether');

    try {
      if (allowance < newAmount) {
        return await unitoken.methods.approve(UNIPOOL, newAmount).send({ from: address });
      }

      if (allowance !== 0) {
        const tx = await unitoken.methods.approve(UNIPOOL, '0').send({ from: address });
        await tx.wait(1);
      }
      return await unitoken.methods.approve(UNIPOOL, newAmount).send({ from: address });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  const handleStake = async () => {
    if (isNaN(amount) !== false) {
      handleAlert('error', 'Error', 'Stake amount can only be entered in numbers');
      return false
    }

    if (amount < 1) {
      handleAlert('error', 'Error', 'Stake amount cannot be less than 1');
      return false
    }

    if (amount > balance) {
      handleAlert('error', 'Error', 'Stake amount cannot be greater than the account balance');
      return false
    }

    try {
      setDisabled(true);
      setPending(true);
      const unipool = new web3.eth.Contract(UNIPOOL_ABI, UNIPOOL, { gasLimit: 150000 });
      await setApprove();

      const newAmount = web3.utils.toWei(amount, 'ether');

      await unipool.methods.stake(newAmount).send({ from: address }).then(result => {
        console.log(result);

        setPending(false);
        setTransaction(result.transactionHash);
        getBalance();
        handleAlert('info', `${amount} UNI-V2 staked`);
        setShowResult(true);
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      setDisabled(false);
      handleAlert('error', 'Error', err.message);
    }
  }

  const handleRefresh = () => {
    setShowResult(false);
    setDisabled(false);
    setAmount(0);
  }

  useEffect(() => {
    if (connected) {
      setDisabled(false);
    }
  }, [connected])

  return (
    <div>
      <Alert severity="info">Learn how to obtain UNI-V2 to participate in the rewards program</Alert>
      <div className={classes.contentWrap}>
      <UniBalance balance={balance} connected={connected} />
        <Input
          disabled={disabled}
          fullWidth
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <div className={classes.marginTop}>
          <div className={classes.mutedText}>Amount of UNI-V2 staked</div>
          <div className={classes.bigBalance}>{staked}</div>
        </div>
      </div>
      {!connected ? (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      ) : (
        <Button variant="contained" color="primary" fullWidth onClick={handleStake} disabled={disabled}>Stake</Button>
      )}
      {showResult && (
        <div>
          <div className={classes.marginTop}>
            <Alert severity="success">
              <AlertTitle>Staking Transaction</AlertTitle>
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

export default Stake;
