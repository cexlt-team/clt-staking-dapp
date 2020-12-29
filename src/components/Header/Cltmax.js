import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address
    };
  }
  render() {
    return (
      <>
        <Content>
          <Link to="/">
            <Navlogo onClick={this.ClickedDropdown}>
              <Logo id="logo" src="/image/icon-clt.png" />
              <CLT>CLT</CLT>
            </Navlogo>
          </Link>
          <Navbar_menu>
            <a href="https://cexlt.io">
              <Home>Back to Home</Home>
            </a>
            <Trade
              onClick={() => {
                window.open(
                  "https://app.uniswap.org/#/swap?inputCurrency=0xa69f7a10df90c4d6710588bc18ad9bf08081f545&outputCurrency=ETH"
                );
              }}
              //check
            >
              Trade CLT
            </Trade>
            <Wallet
              onClick={() => {
                this.props.connectWallet();
              }}
              //check
            >
              {this.state.address
                ? this.state.address.substr(0, 8) +
                  "..." +
                  this.state.address.substr(37, 5)
                : "Connect Wallet"}
            </Wallet>
          </Navbar_menu>
        </Content>
      </>
    );
  }
}
export default NavMenu;

const Navbar_menu = styled.ul`
  text-decoration: none;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  list-style: none;
  padding-right: 20px;

  font-size: 24px;
  .menu_li:hover {
    background-color: wheat;
    border-radius: 4px;
  }
  li {
    padding-left: 12px;
    padding-right: 12px;
  }
`;
const Content = styled.div`
  a {
    text-decoration: none;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
`;
const Navlogo = styled.div`
  display: flex;
  direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 50px;
  margin-top: 20px;
`;
const Logo = styled.img`
  width: 60px;
  height: 60px;
`;
const CLT = styled.div`
  text-decoration: none;
  display: inline-block;
  padding: 0px 0px 0px 15px;
  font-family: NotoSansKR;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.5;
  letter-spacing: -0.2px;
  text-align: center;
  color: #ffffff;
`;
const Home = styled.li`
  text-decoration: none;
  width: 104px;
  height: 14px;
  padding-top: 18px;
  object-fit: contain;
  font-family: NotoSansKR;
  font-size: 16px;
  letter-spacing: -0.2px;
  text-align: center;
  color: #ffffff;
  &:hover {
    color: #2fd8d6;
  }
`;
export const Trade = styled.li`
  font-family: NotoSansKR;
  width: 72px;
  height: 14px;
  padding-top: 18px;
  object-fit: contain;
  font-size: 16px;
  letter-spacing: -0.2px;
  text-align: center;
  color: #ffffff;
  &:hover {
    color: #2fd8d6;
  }
`;
export const Wallet = styled.button`
  font-family: NotoSansKR;
  width: 160px;
  height: 48px;
  margin-left: 12px;
  object-fit: contain;
  border-radius: 10px;
  border: solid 1px #353e4f;
  background-color: #222937;
  font-size: 16px;
  letter-spacing: -0.2px;
  text-align: center;
  color: #2fd8d6;
  background-position: center;
  line-height: 3;
  &:hover {
    background-color: #2a3344;
  }
`;
