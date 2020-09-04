import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from '@material-ui/core/Button';
import { ChainId, Token, WETH, Pair, TokenAmount } from '@uniswap/sdk';

import UniBalance from './UniBalance';

import { UNIV2, UNIV2_ABI, CLT, UNIPOOL_ABI, UNIPOOL } from '../lib/contracts';

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
    fontWeight: 'bold',
    '&> span': {
      fontSize: '1rem',
      color: theme.palette.text.disabled
    }
  },
  marginTop: {
    marginTop: theme.spacing(4)
  }
}));

const Rewards = props => {
  const { web3, address, connected, balance, handleAlert, setPending } = props;

  const [liquidity, setLiquidity] = useState(0);
  const [uniStaked, setUniStaked] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [transaction, setTransaction] = useState('');

  const classes = useStyles();

  const handleClaim = async () => {
    console.log(uniStaked)
    if (uniStaked === '0') {
      handleAlert('error', 'Error', 'Payment cannot be made when Reward is zero');
      return false
    }

    try {
      setPending(true);

      const unipool = new web3.eth.Contract(UNIPOOL_ABI, UNIPOOL);
      await unipool.methods.getReward().send({ from: address }).then(result => {
        console.log(result);

        setPending(false);
        setTransaction(result.transactionHash);
        handleAlert('info', `${uniStaked} CLT claimed`);
        setShowResult(true);
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      handleAlert('error', 'Error', err.message);
    }
  }

  const handleRefresh = () => {
    setPending(false);
    setShowResult(false);
  }

  useEffect(() => {
    const fetchTokenInfo = async () => {
      const uniContract = new web3.eth.Contract(UNIV2_ABI, UNIV2);

      const clt = new Token(ChainId.ROPSTEN, CLT, 18, 'CLT', 'Cex token\'s Liquidity Token');
      const reserves = await uniContract.methods.getReserves().call();
      const reserve0 = reserves[0];
      const reserve1 = reserves[1];

      const tokens = [clt, WETH[clt.chainId]]
      const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]];

      const pair = new Pair(new TokenAmount(token0, reserve0), new TokenAmount(token1, reserve1))
      const reserve = pair.reserve0;

      setLiquidity(reserve.toExact());

      if (connected && web3 && address !== '') {
        const unipool = new web3.eth.Contract(UNIPOOL_ABI, UNIPOOL);
        const uniStaked = await unipool.methods.earned(address).call();

        setUniStaked(uniStaked);
      }
    }

    fetchTokenInfo()
  }, [address, connected, web3])

  return (
    <div>
      <Alert severity="info">Claim all of your rewards from your staked UNI-V2</Alert>
      <div className={classes.contentWrap}>
        <UniBalance balance={balance} connected={connected} />
        <div>
          <div className={classes.mutedText}>Total CLT in the Uniswap liquidity pool</div>
          <div className={classes.bigBalance}>{liquidity}</div>
        </div>
        {connected && (
          <div className={classes.marginTop}>
            <div className={classes.mutedText}>Rewards available to withdraw</div>
            <div className={classes.bigBalance}>{uniStaked} <span>CLT</span></div>
          </div>
        )}
      </div>
      {!connected ? (
        <Alert severity="warning">Please, connect your wallet to get started.</Alert>
      ) : (
        <Button variant="contained" color="primary" fullWidth onClick={handleClaim}>Claim</Button>
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

export default Rewards;
