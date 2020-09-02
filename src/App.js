import React, { useState, Fragment } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

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

const App = () => {
  const [address, setAddress] = useState('')
  const [provider, setProvider] = useState(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/'+INFURA_IDS[Math.floor(Math.random() * 100 % 3)]))
  const [web3, setWeb3] = useState(new Web3(provider))
  const [connected, setConnected] = useState(false)

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

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Header web3={web3} address={address} onConnect={onConnect} />
        <div>Dapp</div>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
