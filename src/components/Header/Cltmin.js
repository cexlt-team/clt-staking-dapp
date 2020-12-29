import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Clt extends React.Component {
  ClickedDropdown(e) {
    if (e.target.tagName == "DIV") return;
    let dropdown = document.getElementById("dropdown");
    let hamburger = document.getElementById("hamburger");
    let bar = "/image/gnb-bar.png";
    let bar_close = "/image/gnb-close@3x.png";
    if (e.target.id == "logo") hamburger.isOn = "true";

    dropdown.style.display = hamburger.isOn == "true" ? "none" : "block";
    hamburger.src = hamburger.isOn == "true" ? bar : bar_close;
    hamburger.isOn = hamburger.isOn == "true" ? "false" : "true";
  }
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address
      // address: "123"
    };
  }
  render() {
    return (
      <Navbar>
        <Content>
          <Link to="/">
            <Navlogo>
              <Logo id="logo" src="/image/icon-clt.png" />
              <CLT>CLT</CLT>
            </Navlogo>
          </Link>
          <Hamburger
            id="hamburger"
            onClick={this.ClickedDropdown}
            src="/image/gnb-bar.png"
            isOn="true"
          ></Hamburger>
        </Content>
        <Dropdown id="dropdown">
          <Content>
            <Link to="/">
              <Navlogo>
                <Logo id="logo" src="/image/icon-clt.png" />
                <CLT>CLT</CLT>
              </Navlogo>
            </Link>
            <Close
              id="close"
              onClick={this.ClickedDropdown}
              src="/image/gnb-close@3x.png"
              isOn="false"
            ></Close>
          </Content>
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
        </Dropdown>
      </Navbar>
    );
  }
}
const Navbar = styled.nav`
  a {
    text-decoration: none;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
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
const Hamburger = styled.img`
  width: 22px;
  height: 17px;
  margin-right: 20px;
  object-fit: contain;
`;
const Close = styled.img`
  width: 25px;
  height: 20px;
  margin-right: 20px;
  object-fit: contain;
`;

const Dropdown = styled.div`
  position: fixed;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.86);
  width: 100%;
  height: 100vh;
  display: none;
  z-index: 1000;
  flex-direction: row;
  justify-content: center;
  .EarlyAccess {
    padding: 0px 0px 0px 0px;
    a {
      text-decoration: none;
      font-family: NanumSquare;
      font-size: 22px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.55;
      letter-spacing: -0.19px;
      color: #ffde22;
    }
  }
`;
const Navbar_menu = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  list-style: none;
  margin: 30px 5px;
  font-size: 24px;
`;

const Home = styled.div`
  width: 206px;
  height: 27px;
  margin: 30px 5px;
  object-fit: contain;
  font-family: NotoSansKR;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.3px;
  text-align: left;
  color: #ffffff;
`;
export const Trade = styled.div`
  width: 145px;
  height: 27px;
  margin: 30px 5px;
  object-fit: contain;
  font-family: NotoSansKR;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.3px;
  text-align: left;
  color: #ffffff;
`;
export const Wallet = styled.div`
  width: 227px;
  height: 27px;
  margin: 30px 5px;
  object-fit: contain;
  font-family: NotoSansKR;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.3px;
  text-align: left;
  color: #2fd8d6;
`;

export default Clt;
