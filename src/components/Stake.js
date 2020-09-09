import React, { useState, useEffect } from 'react';
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
  const [approveDisabled, setApproveDisabled] = useState(true);
  const [stakeDisabled, setStakeDisabled] = useState(true);
  const [showApproveResult, setShowApproveResult] = useState(false);
  const [showStakeResult, setShowStakeResult] = useState(false);
  const [approveTransaction, setApproveTransaction] = useState('');
  const [stakeTransaction, setStakeTransaction] = useState('');

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
        const zeroAmount = web3.utils.toWei('0', 'ether');
        return unitoken.methods.approve(UNIPOOL, zeroAmount).send({ from: address }).then(async result => {
          console.log(result);

          return await unitoken.methods.approve(UNIPOOL, newAmount).send({ from: address });
        })
      }

      return await unitoken.methods.approve(UNIPOOL, newAmount).send({ from: address });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  const handleApprove = async () => {
    setApproveDisabled(true);

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
      setPending(true);

      const result = await setApprove();
      if (result.status) {
        setPending(false);
        setApproveTransaction(result.transactionHash);
        handleAlert('info', `${amount} Approved`);
        setShowApproveResult(true);
        setStakeDisabled(false);
      }
    } catch (err) {
      setApproveDisabled(false);
      handleAlert('error', 'Error', err.message);
    }
  }

  const handleStake = async () => {
    try {
      setPending(true);
      const unipool = new web3.eth.Contract(UNIPOOL_ABI, UNIPOOL, { gasLimit: 150000 });

      const newAmount = web3.utils.toWei(amount, 'ether');

      unipool.methods.stake(newAmount).send({ from: address }).then(result => {
        setPending(false);
        setStakeTransaction(result.transactionHash);
        getBalance();
        handleAlert('info', `${amount} UNI-V2 staked`);
        setShowStakeResult(true);
        setStakeDisabled(true);
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      setStakeDisabled(false);
      handleAlert('error', 'Error', err.message);
    }
  }

  const handleRefresh = () => {
    setShowApproveResult(false);
    setShowStakeResult(false);
    setApproveDisabled(false);
    setStakeDisabled(true);
    setAmount(0);
  }

  useEffect(() => {
    if (connected) {
      setApproveDisabled(false);
    }
  }, [connected])

  return (
    <div>
      <Alert severity="info">Learn how to obtain UNI-V2 to participate in the rewards program</Alert>
      <div className={classes.contentWrap}>
        <UniBalance balance={balance} connected={connected} />
        <Input
          disabled={approveDisabled}
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
        <div>
          <Button variant="contained" color="secondary" fullWidth onClick={handleApprove} disabled={approveDisabled}>1. Approve</Button>
          <Button className={classes.marginTop} variant="contained" color="primary" fullWidth onClick={handleStake} disabled={stakeDisabled}>2. Stake</Button>
        </div>
      )}
      {showApproveResult && (
        <div>
          <div className={classes.marginTop}>
            <Alert severity="success">
              <AlertTitle>Approve Transaction</AlertTitle>
              <a href={`https://ropsten.etherscan.io/tx/${approveTransaction}`} target="_blank" rel="noopener noreferrer">
                {approveTransaction}
              </a>
            </Alert>
          </div>
        </div>
      )}
      {showStakeResult && (
        <div>
          <div className={classes.marginTop}>
            <Alert severity="success">
              <AlertTitle>Staking Transaction</AlertTitle>
              <a href={`https://ropsten.etherscan.io/tx/${stakeTransaction}`} target="_blank" rel="noopener noreferrer">
                {stakeTransaction}
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
