import React, { useState } from "react";
import styled from "styled-components";
import { useHistory, Redirect } from "react-router-dom";

import { TokenCardContainer, TokenImage, TokenName } from "../styles";

function TokenCard({ token }) {
  const {
    id,
    tokenName,
    totalStaked,
    totalValueLocked,
    apr,
    image,
    disable
  } = token;
  const subText = tokenName.split(" ")[0];
  const isPair = image.length === 2;
  const history = useHistory();
  return (
    <TokenCardContainer>
      {isPair ? (
        <TokenPairImageWrapper>
          <TokenLeftImage src={image[0]} />
          <TokenRightImage src={image[1]} />
        </TokenPairImageWrapper>
      ) : (
        <TokenImage src={image} />
      )}
      <TokenName>{tokenName}</TokenName>
      <SubText>Add {subText}</SubText>
      <StakedWrapper>
        <StakedText>Staked</StakedText>
        <Staked>
          <span>
            {parseFloat(
              totalValueLocked ? totalValueLocked : 0
            ).toLocaleString()}
          </span>{" "}
          USD
        </Staked>
      </StakedWrapper>
      <Apr>
        APR:{" "}
        <AprValue>
          {parseFloat(apr ? apr : 0)
            .toPrecision(6)
            .toLocaleString()}
          %
        </AprValue>
      </Apr>
      {disable ? (
        <DisabledButton disabled>Deposit To Mine</DisabledButton>
      ) : (
        <DepositButton
          onClick={() => {
            history.push(`/token/${id}`, { isPair });
          }}
        >
          Deposit To Mine
        </DepositButton>
      )}
    </TokenCardContainer>
  );
}

export default TokenCard;

const TokenPairImageWrapper = styled.div`
  position: absolute;
  top: -60px;
  left: 110px;
`;

const TokenLeftImage = styled.img`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: solid 1px #788296;
  background-color: #ffffff;
`;

const TokenRightImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: solid 1px #788296;
  background-color: #ffffff;
  margin: 10px -10px;
`;

const SubText = styled.div`
  font-size: 14px;
  line-height: 2;
  margin: 15px 0 39px 0;
  color: #788296;
`;

const StakedWrapper = styled.div``;

const StakedText = styled.div`
  font-size: 14px;
  color: #2fd8d6;
`;

const Staked = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
`;

const Apr = styled.div`
  margin: 44px 0;
  font-size: 16px;
  color: #788296;
`;

const AprValue = styled.span`
  color: white;
`;

const DepositButton = styled.button`
  width: 280px;
  height: 55px;
  border-radius: 16px;
  background-color: #2fd8d6;
  border: 0;
  font-size: 22px;
  font-weight: bold;

  &:hover {
    background-color: #38fbf9;
  }
  &:active {
    background-color: #23aeac;
  }
`;

const DisabledButton = styled.button`
  width: 280px;
  height: 65px;
  border-radius: 16px;
  background-color: #222937;
  border: 0;
  font-size: 22px;
  color: #11141a;
  font-weight: bold;
`;
