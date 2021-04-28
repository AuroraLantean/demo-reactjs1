import "./App.css";
import React, { useState, useEffect } from "react";
import {
  init,
  getContractStates,
  stake,
  getStakedAmount,
  getReward,
  withdraw,
} from "./ethereum/ethFunc";

import EthereumContext from "./ethereumContext"; //no {}
import ChildComponent from "./ChildComponent";

function App() {
  const [erc20States, setERC20States] = useState([0]);
  const [rewardsStates, setRewardsStates] = useState([0, 0, 0, 0, 0]);
  const [compo, setCompo] = useState([]);

  let blockTimestamp = 0,
    periodFinish = 0,
    rewardRate = 0,
    lastUpdateTime = 0,
    rewardPerTokenStored = 0;
  useEffect(() => {
    //cannot add async here, so make async below
    const init2 = async () => {
      const result = await init().catch((err) => {
        console.log(`${err}`);
        //alert(`initialization failed`);
        return;
      });
      setCompo(result);
    };
    init2();
  }, []); //[] for running once

  //wait for all requirements are populated: load initial conditions
  useEffect(() => {
    const load = async () => {
      const result = await getContractStates(compo).catch((err) => {
        console.log(`${err}`);
        return;
      });
      if (
        result !== "undefined" &&
        Array.isArray(result) &&
        result.length > 1
      ) {
        setERC20States(result[0]);
        setRewardsStates(result[1]);
      }
    };
    load();
  }, [compo]);

  if (typeof web3 === "undefined") {
    return <div>Loading web3, accounts, instERC20, instRewards</div>;
  } else {
    if (typeof rewardsStates !== "undefined") {
      blockTimestamp = rewardsStates["0"];
      periodFinish = rewardsStates["1"];
      rewardRate = rewardsStates["2"];
      lastUpdateTime = rewardsStates["3"];
      rewardPerTokenStored = rewardsStates["4"];
    }
    return (
      <div className="App">
        <EthereumContext.Provider value={compo}>
          <h1>Go Ethereum!</h1>
          <p>smart contracts are ready...</p>
          <div>User's ERC20 balance is {erc20States[0]}</div>
          <p>Reward contract Data1: </p>
          <p>block timestamp: {blockTimestamp}</p>
          <p>periodFinish: {periodFinish}</p>
          <p>rewardRate: {rewardRate}</p>
          <p>lastUpdateTime: {lastUpdateTime}</p>
          <p>rewardPerTokenStored: {rewardPerTokenStored}</p>

          <ChildComponent></ChildComponent>
        </EthereumContext.Provider>
      </div>
    );
  }
}

export default App;
