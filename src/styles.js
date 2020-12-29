import React from "react";
import styled from "styled-components";

export const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TokenLogo = styled.img`
  width: 60px;
  height: 60px;
`;

export const Title = styled.h2`
  font-size: 52px;
  font-weight: bold;
  line-height: 0.54;
  letter-spacing: -0.52px;
  text-align: center;
  color: #ffffff;
`;

export const TotalValueWrapper = styled.div`
  text-align: center;
`;

export const TotalValueText = styled.div`
  margin: 60px 102px 18px 100px;
  font-size: 22px;
  color: #ffffff;
`;

export const TotalValue = styled.div`
  display: inline-block;
  font-size: 30px;
  color: #ffffff;
  margin-right: 10px;
`;

export const Unit = styled.div`
  display: inline-block;
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
`;

export const SubText = styled.div`
  font-family: NotoSansKR;
  font-size: 18px;
  margin: 25px 0;
  line-height: 1.56;
  text-align: center;
  color: #788296;
`;

export const TokenCardList = styled.ul`
  padding: 0 !important;
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto;
`;

export const TokenCardContainer = styled.div`
  position: relative;
  width: 320px;
  height: 400px;
  margin: 95px 26px;
  border-radius: 40px;
  border: solid 1px #29303e;
  background-image: linear-gradient(to top, #1c222d, #212937);
  text-align: center;
`;

export const TokenImage = styled.img`
  position: absolute;
  top: -35px;
  left: 131px;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  border: solid 1px #788296;
  background-color: #ffffff;
`;

export const TokenName = styled.h3`
  margin-top: 50px;
  margin-bottom: 18px;
  font-size: 28px;
  text-align: center;
  color: #ffffff;
`;
