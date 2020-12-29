import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { Home, TokenDetail } from "./pages";
import Cltmin from "./components/Header/Cltmin";
import Cltmax from "./components/Header/Cltmax";
import { isMobile } from "react-device-detect";
import tokenData from "./lib/tokens";

import Web3 from "web3";
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";

import { CLT_ADDRESS, UNIPOOL_ABI, UNIV2_ABI, CLT_ABI } from "./lib/contracts";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const apollo = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  cache: new InMemoryCache()
});

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "7a615246e88c4081a263552f80cf3060"
    }
  }
};

const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions
});

const providerConfig =
  "https://mainnet.infura.io/v3/7a615246e88c4081a263552f80cf3060";

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      provider: new Web3.providers.HttpProvider(providerConfig),
      web3: new Web3(new Web3.providers.HttpProvider(providerConfig)),
      accounts: undefined,
      address: undefined,
      isConnected: false,
      isHamberger: isMobile,
      tokens: tokenData.tokens,
      totalValueLocked: 0,
      CLT: undefined
    };
    if (window.innerWidth < 960 && !this.state.isHamberger) {
      this.state.isHamberger = true;
    }
  }
  updateDimensions = props => {
    if (window.innerWidth < 960 && !this.state.isHamberger) {
      this.state.isHamberger = true;
      this.forceUpdate();
    }
    if (window.innerWidth > 960 && this.state.isHamberger) {
      this.state.isHamberger = false;
      this.forceUpdate();
    }
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.initWeb3();
    this.getContractInstance();
    this.getBalance();
    setInterval(this.getBalance, 5000);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  getContractInstance = async () => {
    const web3 = this.state.web3;
    var tokens = this.state.tokens;
    const CLT = new web3.eth.Contract(CLT_ABI, CLT_ADDRESS);

    for (var i = 0; i < tokens.length; i++) {
      const stake = new web3.eth.Contract(UNIV2_ABI, tokens[i].addresses.stake);
      const pool = new web3.eth.Contract(UNIPOOL_ABI, tokens[i].addresses.pool);
      tokens[i].contract.pool = pool;
      tokens[i].contract.stake = stake;
    }

    this.setState({
      tokens: tokens,
      CLT: CLT
    });
    this.getBalance();
  };
  getUniPairInfo = async pair => {
    return apollo.query({
      query: gql`
        query GetRates {
          pair(id: "${pair}") {
            id
            totalSupply
            reserveUSD
          }
        }
      `
    });
  };
  getUniHTPrice = async () => {
    const pair = await apollo.query({
      query: gql`
        query GetRates {
          pair(id: "0x26ce49c08ee71aff0c43db8f8b9bea950b6cdc67") {
            id
            token1Price
          }
        }
      `
    });
    const token1Price = pair.data.pair.token1Price;
    return token1Price;
  };

  getUniCLTPrice = async () => {
    const ap = await apollo.query({
      query: gql`
        query GetRates {
          token(id: "0xa69f7a10df90c4d6710588bc18ad9bf08081f545") {
            id
            derivedETH
          }
        }
      `
    });
    const token1Price = ap.data.token.derivedETH;
    return token1Price;
  };
  getUniETHprice = async () => {
    const pair = await apollo.query({
      query: gql`
        query GetRates {
          pair(id: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852") {
            id
            reserve0
            reserve1
          }
        }
      `
    });
    const reserveETH = pair.data.pair.reserve0;
    const reserveUSDT = pair.data.pair.reserve1;
    return reserveUSDT / reserveETH;
  };
  getBalance = async () => {
    const web3 = this.state.web3;
    const tokens = this.state.tokens;
    const address = this.state.address;
    var ETHPrice = await this.getUniETHprice();
    var CLTPrice = await this.getUniCLTPrice();
    CLTPrice = CLTPrice * ETHPrice;
    var totalValueLocked = 0;
    // if (tokens == undefined) setTimeout(this.getBalance, 500);
    for (var i = 0; i < tokens.length; i++) {
      if (
        window.location.pathname != "/" &&
        parseInt(window.location.pathname.split("/")[2]) != i
      )
        continue;
      try {
        var pair;
        var reserveUSD;
        var reward;
        tokens[i].totalStaked = web3.utils.fromWei(
          await tokens[i].contract.pool.methods.totalSupply().call()
        );
        reward = web3.utils.fromWei(
          await this.state.CLT.methods
            .balanceOf(tokens[i].addresses.pool)
            .call()
        );

        if (tokens[i].image.length == 2) {
          pair = await this.getUniPairInfo(tokens[i].addresses.stake);
          reserveUSD = pair.data.pair.reserveUSD;

          tokens[i].totalValueLocked =
            (reserveUSD / pair.data.pair.totalSupply) * tokens[i].totalStaked;
          tokens[i].apr =
            (((365 / 50) * reward * CLTPrice) / tokens[i].totalValueLocked) *
            100;
        } else {
          //ETH
          if (
            tokens[i].addresses.stake ===
            "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
          ) {
            tokens[i].totalValueLocked = ETHPrice * tokens[i].totalStaked;
            tokens[i].apr =
              (((365 / 50) * reward * CLTPrice) / tokens[i].totalValueLocked) *
              100;
          }
          //HT
          if (
            tokens[i].addresses.stake ===
            "0x6f259637dcd74c767781e37bc6133cd6a68aa161"
          ) {
            const HTPrice = await this.getUniHTPrice();
            tokens[i].totalValueLocked =
              0 + HTPrice * ETHPrice * tokens[i].totalStaked;
            tokens[i].apr =
              (((365 / 50) * reward * CLTPrice) / tokens[i].totalValueLocked) *
              100;
          }
        }

        totalValueLocked = totalValueLocked + tokens[i].totalValueLocked;
        if (address === undefined) continue;

        tokens[i].earned = web3.utils.fromWei(
          await tokens[i].contract.pool.methods.earned(address).call()
        );
        tokens[i].staked = web3.utils.fromWei(
          await tokens[i].contract.pool.methods.balanceOf(address).call()
        );

        const allowance = await tokens[i].contract.stake.methods
          .allowance(address, tokens[i].addresses.pool)
          .call();
        if (parseInt(allowance) > 0) tokens[i].approval = true;
      } catch (e) {
        console.log(e);
      }
    }
    console.log(tokens);
    this.setState({
      tokens: tokens,
      totalValueLocked: totalValueLocked
    });
  };
  initWeb3 = async () => {
    const provider = await new Web3.providers.HttpProvider(providerConfig);
    const web3 = await new Web3(provider);
    this.setState({
      provider: provider,
      web3: web3
    });
  };
  connectWallet = async () => {
    const provider = await web3Modal.connect();
    const web3 = await new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    this.setState({
      provider: provider,
      web3: web3,
      isConnected: true,
      accounts: accounts,
      address: accounts[0]
    });
    this.getBalance();
    this.getContractInstance();
  };
  checkConnected = () => {
    if (this.state.address == undefined) alert("Please Connect Wallet");
  };
  harvest = token => {
    this.checkConnected();
    if (this.state.address == undefined) return;
    token.contract.pool.methods.getReward().send({ from: this.state.address });
  };
  approve = async token => {
    this.checkConnected();
    const web3 = this.state.web3;
    const address = this.state.address;
    await token.contract.stake.methods
      .approve(token.addresses.pool, web3.utils.toWei("9999999999", "ether"))
      .send({ from: address });
  };
  stake = async token => {
    this.checkConnected();
    const web3 = this.state.web3;
    const address = this.state.address;

    if (this.state.address == undefined) return;

    const userLP = await token.contract.stake.methods.balanceOf(address).call();

    var amount = prompt(
      "Amount (You have " + web3.utils.fromWei(userLP, "ether") + ")"
    );

    amount = typeof amount === typeof "string" ? amount : "0";
    if (parseFloat(amount) <= 0) return;

    token.contract.pool.methods
      .stake(web3.utils.toWei(amount, "ether"))
      .send({ from: address });
  };
  unstake = token => {
    this.checkConnected();
    if (this.state.address == undefined) return;
    token.contract.pool.methods.exit().send({ from: this.state.address });
  };
  render() {
    function Page(props) {
      if (window.innerWidth > 960 && !props.isHamberger)
        return (
          <Cltmax connectWallet={props.connectWallet} address={props.address} />
        );
      else
        return (
          <Cltmin connectWallet={props.connectWallet} address={props.address} />
        );
    }
    return (
      <BrowserRouter>
        <GlobalStyle />
        <Background>
          <Page
            connectWallet={this.connectWallet}
            address={this.state.address}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  tokens={this.state.tokens}
                  totalValueLocked={this.state.totalValueLocked}
                />
              )}
            />
            <Route
              exact
              path="/token/:id"
              render={() => (
                <TokenDetail
                  tokens={this.state.tokens}
                  harvest={this.harvest}
                  stake={this.stake}
                  unstake={this.unstake}
                  approve={this.approve}
                />
              )}
            />
          </Switch>
        </Background>
      </BrowserRouter>
    );
  }
}
export default App;
const Background = styled.div`
  background-image: url("/image/background.png");
  background-size: cover;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  object-fit: contain;
  margin: 0;
`;
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  },
  html {
    height: 100%;
  }
`;
