import React from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import TokenDetailCard from "../components/TokenDetailCard";
import {
  MainContainer,
  Title,
  TotalValueWrapper,
  TotalValueText,
  TotalValue,
  Unit,
  SubText,
  TokenCardList
} from "../styles";

function TokenDetail({ tokens, harvest, stake, unstake, approve }) {
  const history = useHistory();
  const id = useLocation().pathname.split("/")[2];
  const isPair = tokens[id].image.length === 2;
  return (
    <MainContainer>
      <Title>{tokens[id].tokenName}</Title>
      <TotalValueWrapper>
        <TotalValueText>Total locked</TotalValueText>
        <TotalValue>{tokens[id].totalStaked.toLocaleString()}</TotalValue>
        <Unit>{isPair ? " LP" : tokens[id].tokenName.split(" ")[0]}</Unit>
      </TotalValueWrapper>
      <SubText>
        Earn CLT by staking your {tokens[id].tokenName.split(" ")[0]}
      </SubText>
      <TokenCardList>
        <TokenDetailCard
          key={1}
          value={tokens[id].earned}
          unit={"CLT"}
          subText="Earned"
          image={"/image/tokens/symbol-clt.png"}
          token={tokens[id]}
          harvest={harvest}
          stake={stake}
          unstake={unstake}
          approve={approve}
        />
        <TokenDetailCard
          key={2}
          value={tokens[id].staked}
          unit={isPair ? "LP" : tokens[id].tokenName.split(" ")[0]}
          subText="Staked"
          image={isPair ? tokens[id].image[0] : tokens[id].image}
          token={tokens[id]}
          harvest={harvest}
          stake={stake}
          unstake={unstake}
          approve={approve}
        />
      </TokenCardList>
    </MainContainer>
  );
}

export default TokenDetail;
