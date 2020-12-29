import React from "react";
import HomeMain from "../components/HomeMain";

function Home({ tokens, totalValueLocked }) {
  return (
    <>
      <HomeMain tokens={tokens} totalValueLocked={totalValueLocked} />
    </>
  );
}

export default Home;
