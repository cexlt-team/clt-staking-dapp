import React from "react";
import styled from "styled-components";
import CountUp from "react-countup";

import { Unit, SubText } from "../styles";

function TokenDetailCard({
  value = 0,
  unit,
  subText,
  image,
  harvest,
  token,
  stake,
  unstake,
  approve
}) {
  return (
    <TokenDetailCardContainer>
      <TokenImage src={image} />
      <StakedWrapper>
        <Staked>
          <span>
            <CountUp
              preserveValue={true}
              end={parseFloat(value)}
              decimals={8}
              duration={1}
            ></CountUp>
          </span>{" "}
          {unit}
        </Staked>
      </StakedWrapper>
      <SubText>{subText}</SubText>
      {unit === "CLT" ? (
        <HarvestButton onClick={() => harvest(token)}>Harvest</HarvestButton>
      ) : (
        <>
          {token.approval ? (
            <UnstakedButton
              onClick={() => {
                console.log(token.approval);
                unstake(token);
              }}
            >
              Unstake
            </UnstakedButton>
          ) : (
            <UnstakedButton
              onClick={() => {
                approve(token);
              }}
            >
              Approve
            </UnstakedButton>
          )}

          <AddButton onClick={() => stake(token)}>
            <PlusIcon>+</PlusIcon>
          </AddButton>
        </>
      )}
    </TokenDetailCardContainer>
  );
}

export default TokenDetailCard;

const TokenDetailCardContainer = styled.div`
  position: relative;
  width: 320px;
  height: 230px;
  margin: 95px 26px;
  padding: 60px 20px 21px;
  @media (max-width: 640px) {
    margin: 95px 0px;
    padding: 60px 0px 0px;
  }
  border-radius: 40px;
  border: solid 1px #29303e;
  background-image: linear-gradient(to top, #1c222d, #212937);
  text-align: center;
`;

const StakedWrapper = styled.div``;

const Staked = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
`;

const HarvestButton = styled.button`
  width: 280px;
  height: 65px;
  border-radius: 16px;
  background-color: #2fd8d6;
  border: 0;
  font-size: 22px;
  color: #11141a;
  font-weight: bold;

  &:hover {
    background-color: #38fbf9;
  }
  &:active {
    background-color: #23aeac;
  }
`;

const UnstakedButton = styled.button`
  width: 198px;
  height: 65px;
  border-radius: 16px;
  background-color: #2fd8d6;
  border: 0;
  font-size: 22px;
  color: #11141a;
  font-weight: bold;

  &:hover {
    background-color: #38fbf9;
  }
  &:active {
    background-color: #23aeac;
  }
`;

const AddButton = styled.button`
  width: 74px;
  height: 70px;
  margin: 0 0 0 8px;
  padding: 23px;
  border-radius: 16px;
  border: solid 1px #353e4f;
  background-color: #222937;
  color: #2fd8d6;
`;

const PlusIcon = styled.span`
  display: inline-block;
  border-radius: 1px;
  color: #2fd8d6;
  font-size: 30px;
  line-height: 0.6;
`;
export const TokenImage = styled.img`
  position: absolute;
  top: -32px;
  left: 145px;
  width: 65px;
  height: 65px;
  border-radius: 100%;
  border: solid 1px #788296;
  background-color: #ffffff;
`;
