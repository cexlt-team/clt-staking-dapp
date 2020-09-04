import React, { useState, useEffect, Fragment } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import TabPanel from './components/TabPanel';
import Stake from './components/Stake';
import Withdraw from './components/Withdraw';
import Rewards from './components/Rewards';

import Web3 from 'web3';
import Web3Modal from 'web3modal';

import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';
import UniLogin from '@unilogin/provider';
import Portis from '@portis/web3';
import MewConnect from '@myetherwallet/mewconnect-web-client';

import theme from './theme';

import Header from './components/Header';

import { UNIPOOL, UNIPOOL_ABI, UNIV2, UNIV2_ABI } from './lib/contracts';

const INFURA_IDS = [
  'e8e1d9e3d7e64288928f45d9f6c40ec2',
  'f1735959d5c8495bb9584d4d071a1af1',
  'fdb44b5eea324728ad8128d305cddc84'
];

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'e8e1d9e3d7e64288928f45d9f6c40ec2'
    }
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: 'pk_live_262B43464149D868'
    }
  },
  torus: {
    package: Torus,
  },
  authereum: {
    package: Authereum
  },
  unilogin: {
    package: UniLogin
  },
  portis: {
    package: Portis,
    options: {
      id: 'f0a2ea04-f728-4fa2-b49c-83e9495495ee'
    }
  },
  mewconnect: {
    package: MewConnect,
    options: {
      infuraId: 'fdb44b5eea324728ad8128d305cddc84'
    }
  }
};

const web3Modal = new Web3Modal({
  network: 'ropsten',
  cacheProvider: true,
  providerOptions
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentWrap: {
    width: '762px',
    padding: '20px 20px 0px',
    '@media (min-width: 280px) and (max-width: 480px)': {
      width: 'calc(100% - 20px)',
      padding: '5px 5px 0px'
    }
  }
}));

const App = () => {
  const classes = useStyles();

  const [tabValue, setTabValue] = useState(1);

  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/'+INFURA_IDS[Math.floor(Math.random() * 100 % 3)]));
  const [web3, setWeb3] = useState(new Web3(provider));
  const [connected, setConnected] = useState(false);
  const [staked, setStaked] = useState(0);
  const [balance, setBalance] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const a11yProps = index => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  };

  const handleTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAddress('');
    setWeb3(null);
    setProvider(null);
    setConnected(false);
  };

  const subscribeProvider = async (provider,web3) => {
    if (!provider.on) {
      return
    }
    provider.on('close', () => resetApp(web3));
    provider.on('accountsChanged', async (accounts) => {
      setAddress(accounts[0]);
    });
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    const web3 = await new Web3(provider);
    await subscribeProvider(provider,web3);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    setConnected(true);
    setAddress(address);
    setProvider(provider);
    setWeb3(web3);
  };

  const handleAlert = (type, title, message) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  }

  useEffect(() => {
    if (connected && web3 && address !== '') {
      const unipool = new web3.eth.Contract(UNIPOOL_ABI, UNIPOOL);

      unipool.methods.balanceOf(address).call().then(result => {
        const value = web3.utils.fromWei(result, 'ether')
        
        setStaked(value)
      }).catch(error => {
        console.log(error)
      })

      const uniToken = new web3.eth.Contract(UNIV2_ABI, UNIV2);

      uniToken.methods.balanceOf(address).call().then(result => {
        const value = web3.utils.fromWei(result, 'ether')
        setBalance(value)
      }).catch(error => {
        console.log(error)
      })
    }
  }, [address, connected, web3])

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Header web3={web3} address={address} onConnect={onConnect} />
        <div className={classes.root}>
          <Paper className={classes.contentWrap} elevation={3}>
            <Tabs
              value={tabValue}
              onChange={handleTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="tab"
            >
              <Tab label="Stake" {...a11yProps(0)} />
              <Tab label="Withdraw" {...a11yProps(1)} />
              <Tab label="Claim rewards" {...a11yProps(2)} />
            </Tabs>
            <div>
              <TabPanel value={tabValue} index={0}>
                <Stake connected={connected} address={address} web3={web3} staked={staked} balance={balance} handleAlert={handleAlert} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Withdraw connected={connected} address={address} web3={web3} staked={staked} balance={balance} handleAlert={handleAlert} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Rewards />
              </TabPanel>
            </div>
          </Paper>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={alertOpen}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity={alertType}>
            <AlertTitle>{alertTitle}</AlertTitle>
            {alertMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
