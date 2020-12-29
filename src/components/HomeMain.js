import React from "react";
import styled from "styled-components";
import TokenCard from "./TokenCard";
import {
  MainContainer,
  TokenLogo,
  Title,
  TotalValueWrapper,
  TotalValueText,
  TotalValue,
  Unit,
  SubText,
  TokenCardList
} from "../styles";

function HomeMain({ tokens, totalValueLocked }) {
  return (
    <MainContainer>
      <TokenLogo src="./image/icon-clt.png" />
      <Title>Cexlt Finance</Title>
      <TotalValueWrapper>
        <TotalValueText>Total Value locked</TotalValueText>
        <TotalValue>{parseInt(totalValueLocked)}</TotalValue>
        <Unit>USD</Unit>
      </TotalValueWrapper>
      <SubText>
        Earn CLT by staking your favourite Cexlt's partner token
      </SubText>
      <TokenCardList>
        {tokens.map((token, idx) => (
          <TokenCard key={idx} token={token} />
        ))}
      </TokenCardList>
    </MainContainer>
  );
}
export default HomeMain;
