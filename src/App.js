import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import React, { useState, useEffect } from "react";
import { Form, Button, Input, Label, Message,  Dropdown,
  Grid, } from "semantic-ui-react";
//Card, Header, Segment, GridRow, Dropdown, Grid,

//import { DropDownRewardsCtrts } from "./dropdown";
import {init, log1, fromWei, toWei,  
} from "./ethereum/ethFunc"; //getGasData, getERC20Balance, fromWei, checkNetwork, getAricBalance,
import { assetNames, addrTos, config } from "./ethereum/config"; //rewardsCtrtIdxes, dbSelections, assetNames, addrTos,
import { BalanceOf, ReadSalesCtrt, buyViaToken, buyViaETH, transferToken, withdrawToken, } from "./ethereum/store";

//import Header from './components/header/header';

/**
To add a function: duplicate App function, errMsg, UI, store function(Ethereum function), replace from red part in App.js
*/
import EthereumContext from "./ethereumContext"; //no {}

function App() {
  if (window.ethereum) window.ethereum.autoRefreshOnNetworkChange = false;

  const gasPriceDefault = config.gasPrice; //1 GWei
  const gasLimitDefault = config.gasLimit; //1000000
  const [compo, setCompo] = useState([]);
  const [amount, amountSet] = useState("0.001");
  const [amountToWithdraw, amountToWithdrawSet] = useState("0.001");

  const [gasPrice, setGasPrice] = useState(gasPriceDefault);
  const [gasLimit, setGasLimit] = useState(gasLimitDefault);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const userChoice = config.defaultUserChoice;
  let toAddrDefault;
  if (userChoice === 1) {
    toAddrDefault = config.user1;
  } else {
    toAddrDefault = config.user2;
  }
  const [addrTo, addrToSet] = useState(config.SalesCtrt_Kovan);
  const [tokenBalanceAcct, tokenBalanceAcctSet] = useState("");
  const [tokenBalanceAddr, tokenBalanceAddrSet] = useState("");

  const [assetName, assetNameSet] = useState("bitcoin");
  const [slotId, slotIdSet] = useState("");

  const [buyViaToken1ErrMsg, buyViaToken1ErrMsgSet] = useState("");
  const [transferToken1ErrMsg, transferToken1ErrMsgSet] = useState("");
  const [withdrawToken1ErrMsg, withdrawToken1ErrMsgSet] = useState("");


  useEffect(() => {
    //cannot add async here, so make async below
    const initAction = async () => {
      const compo1 = await init().catch((err) => {
        console.error(`initAction failed: ${err}`);
        //alert(`initialization failed`);
        return;
      });
      //log1("compo1 length:", compo1.length)
      // await BalanceOf1();
      // await CheckUser1();
      // await CheckAvailable1();
      setCompo(compo1);

      if (!window.ethereum) {
        console.error("window.ethereum does not exist");
        return;
      }
      const provider = window.ethereum;
      const isMetaMask2 = provider.isMetaMask;
      log1("isMetaMask2:", isMetaMask2);

      provider.on("accountsChanged", (accounts) => {
        log1("accountsChanged:", accounts);
        if (accounts.length === 0) {
          console.error("accounts are empty");
        }
        setCompo((prevCompo) => [
          prevCompo[0],
          accounts,
          prevCompo[2],
          prevCompo[3],
        ]);
      });

      provider.on("chainChanged", (chainId) => {
        log1("App chainId:", chainId);
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });
    };
    initAction();
  }, []); //[] for running once

  //wait for all requirements are populated: load initial conditions
  useEffect(() => {
    const run = async () => {
      log1("useEffect2: good");
      await balanceOfAcct1();
      //await ReadSalesCtrt1();
    };
    if (!Array.isArray(compo) || !compo.length) {
      log1("useEffect2: is not an array, or is empty");
    } else {
      run();
    }
  }, [compo]);

  //const delayInMilliseconds = 5000; //1 second
  // const showErrForDuration = async () => {
  //   setTimeout(function () {
  //     //your code to be executed after 1 second
  //   }, delayInMilliseconds);
  // };

  const balanceOfAcct1 = async (event) => {
    if (event) event.preventDefault();
    log1("---------== balanceOfAcct1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await BalanceOf(compo).catch((err) => {
      console.error("err@BalanceOf:", err);
      tokenBalanceAcctSet("?");
      //setErrMsg("balanceOfAcct1 failed");
      return false;
    });
    tokenBalanceAcctSet(fromWei(data1));
  };

  const balanceOfAddr1 = async (event) => {
    if (event) event.preventDefault();
    log1("---------== balanceOfAddr1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await BalanceOf(compo, addrTo).catch((err) => {
      console.error("err@BalanceOf:", err);
      tokenBalanceAcctSet("?");
      //setErrMsg("balanceOfAddr1 failed");
      return false;
    });
    tokenBalanceAddrSet(fromWei(data1));
  };

  const ReadSalesCtrt1 = async (event) => {
    if (event) event.preventDefault();
    log1("---------== ReadSalesCtrt1()");
    // setLoading(true);
    // setErrMsg("");
    const data1 = await ReadSalesCtrt(compo).catch((err) => {
      console.error("err@ReadSalesCtrt:", err);
      tokenBalanceAcctSet("?");
      //setErrMsg("ReadSalesCtrt1 failed");
      return false;
    });
    log1("slotPrices[1]:", data1)
    //tokenBalanceAcctSet(fromWei(data1));
  };

  let networkId = 0;
  if (compo === undefined || compo.length !== 4) {
    log1("compo failed", compo);
    networkId = 0;
  } else {
    networkId = compo[2];
  }
  // if (typeof rewardsStates !== "undefined") {
  //   //checking reading from smart contracts
  // }

  //--------------------== Write Functions of ERC20FixedSupply
  const transferToken1 = async (event) => {
    event.preventDefault();
    log1("---------== transferToken1()");
    setLoading(true);
    transferToken1ErrMsgSet("");
    const errSource = "transferToken1";
    if (!checkNumeric(amount, errSource)) {
      transferToken1ErrMsgSet("Please enter a valid amount");
      amountSet("");
      setLoading(false);
      return false;
    }

    let isToRun = 1 === 1;
    log1("gasPrice:", gasPrice, ", gasLimit:", gasLimit, "amount:", amount)
    let result;
    if(isToRun){
      result = await transferToken(
      compo, gasPrice, gasLimit, addrTo, toWei(amount)).catch((err) => {
        //console.warn("err:", err);
        transferToken1ErrMsgSet("transferToken1 failed");
        setLoading(false);
        return false;
      });
    } else {
      transferToken1ErrMsgSet("");
      setLoading(false);
      log1("buyViaTokenCheck result:", result);
      return true;
    }
    setLoading(false);
    if(result){
      log1("success! txn Hash:", result);
    } else {
      log1("failure. result:", result);
    }
  };

  //--------------------== Write Functions of SalesCtrt
  const buyViaToken1 = async (event) => {
    event.preventDefault();
    log1("---------== buyViaToken1()");
    setLoading(true);
    buyViaToken1ErrMsgSet("");
    const errSource = "buyViaToken1";
    if (!checkNumeric(slotId, errSource)) {
      buyViaToken1ErrMsgSet("Please enter a valid slotId");
      slotIdSet("");
      setLoading(false);
      return false;
    }

    let isToRun = 1 === 1;
    log1("gasPrice:", gasPrice, ", gasLimit:", gasLimit, "amount:", slotId)
    let result;
    if(isToRun){
      result = await buyViaToken(
      compo, gasPrice, gasLimit, slotId).catch((err) => {
        //console.warn("err:", err);
        buyViaToken1ErrMsgSet("buyViaToken1 failed");
        setLoading(false);
        return false;
      });
    } else {
      // result = await buyViaTokenCheck(
      buyViaToken1ErrMsgSet("");
      setLoading(false);
      log1("buyViaTokenCheck result:", result);
      return true;
    }
    setLoading(false);
    if(result){
      log1("success! txn Hash:", result);
    } else {
      log1("failure. result:", result);
    }
  };

  const withdrawToken1 = async (event) => {
    event.preventDefault();
    log1("---------== withdrawToken1()");
    setLoading(true);
    withdrawToken1ErrMsgSet("");
    const errSource = "withdrawToken1";
    if (!checkNumeric(amountToWithdraw, errSource)) {
      withdrawToken1ErrMsgSet("Please enter a valid amountToWithdraw");
      amountToWithdrawSet("");
      setLoading(false);
      return false;
    }

    let isToRun = 1 === 1;
    log1("gasPrice:", gasPrice, ", gasLimit:", gasLimit, "amountToWithdraw:", amountToWithdraw)
    let result;
    if(isToRun){
      result = await withdrawToken(
      compo, gasPrice, gasLimit, addrTo, toWei(amountToWithdraw)).catch((err) => {
        //console.warn("err:", err);
        withdrawToken1ErrMsgSet("withdrawToken1 failed");
        setLoading(false);
        return false;
      });
    } else {
      // result = await buyViaTokenCheck(
      withdrawToken1ErrMsgSet("");
      setLoading(false);
      log1("buyViaTokenCheck result:", result);
      return true;
    }
    setLoading(false);
    if(result){
      log1("success! txn Hash:", result);
    } else {
      log1("failure. result:", result);
    }
  };

  //--------------------==
  const checkNumeric = (inputValue, inputSource) => {
    log1("checkNumeric", inputValue);
    if (inputValue === "" || inputValue < 0 || isNaN(inputValue)) {
      const errMsg =
        "input error@ " +
        inputSource +
        ": amount cannot be empty, zero, negative, or non-numeric";
      console.warn(errMsg);
      showErr(inputSource, errMsg);
      return false;
    } else {
      log1("checkNumeric Ok");
      clearErr(inputSource);
      return true;
    }
  };
  const showErr = (inputSource, errMsg) => {
    switch (inputSource) {
      case "gasPrice":
        setErrMsg(errMsg);
        break;
      default:
        setErrMsg(errMsg);
        console.warn("showErr: no matched inputSource");
    }
  };
  const clearErr = (inputSource) => {
    switch (inputSource) {
      case "gasPrice":
        setErrMsg("");
        break;
      default:
        console.warn("clearErr: no matched inputSource");
        setErrMsg("");
      }
  };

  const handleDropdown_assetName = (e, { value }) => {
    log1("handleDropdown_assetName value:", value);
    assetNameSet(value);
  };
  const handleDropdown_addrTo = (e, { value }) => {
    log1("handleDropdown_addrTo value:", value);
    addrToSet(value);
  };


  return (
    <div className="App">
      <EthereumContext.Provider value={compo}>
        <h1>ARK Coins</h1>
        <h3>
          Connected Network:{" "}
          {networkId === 0
            ? "Please use WEB3 browser and choose correct network"
            : networkId}
          , Network ID:{" "}
          {networkId === Number(config.contractGroupId)
            ? "Ok"
            : "Incorrect Network"}
        </h3>
        <h3>Connected address: {compo[1]}</h3>

        <br></br>
        <Form onSubmit={balanceOfAcct1}>
          <Button content="Balance Of Connected Account" color="green" />
          <Label size={"huge"}>{tokenBalanceAcct} ARIC Coins</Label>
        </Form>

        <Form onSubmit={balanceOfAddr1}>
          <Button content="Balance Of Selected Address" color="green" />
          <Label size={"huge"}>{tokenBalanceAddr} ARIC Coins</Label>
        </Form>

        <br></br>
        <h3>Contract Functions</h3>
        <Grid columns={2}>
          <Grid.Row centered columns={2}>
            <Grid.Column>
              <Dropdown
                placeholder="Select AssetName"
                scrolling
                wrapSelection={false}
                selection
                options={assetNames}
                onChange={handleDropdown_assetName}
              />
            </Grid.Column>
            <Grid.Column>
              <Label>Contract index: {assetName}</Label>
            </Grid.Column>

            <Grid.Column>
              <Dropdown
                placeholder="Select Address"
                scrolling
                wrapSelection={false}
                selection
                options={addrTos}
                onChange={handleDropdown_addrTo}
              />
            </Grid.Column>
            <Grid.Column>
              <Label>Address: {addrTo}</Label>
            </Grid.Column>

          </Grid.Row>
        </Grid>
        <br></br>
        <Input
            label=""
            labelPosition="right"
            placeholder="0x..."
            value={addrTo}
            onChange={(event) => {
              addrToSet(event.target.value);
            }}
          />

        <br></br>
        <Form
            onSubmit={transferToken1}
            error={!!transferToken1ErrMsg}
        >
          <Button content="transferToken" color="green" />
          <Input
            label=""
            labelPosition="right"
            placeholder="amount in Ether"
            value={amount}
            onChange={(event) => {
              amountSet(event.target.value);
            }}
          />
        </Form>

        <br></br>
        <Form
            onSubmit={withdrawToken1}
            error={!!withdrawToken1ErrMsg}
        >
          <Button content="WithdrawToken" color="green" />
          <Input
            label=""
            labelPosition="right"
            placeholder="amount in Ether"
            value={amountToWithdraw}
            onChange={(event) => {
              amountSet(event.target.value);
            }}
          />
        </Form>

        <br></br>
        <Form
            onSubmit={buyViaToken1}
            error={!!buyViaToken1ErrMsg}
        >
          <Button content="BuyViaToken" color="green" />
          <Input
            label=""
            labelPosition="right"
            placeholder="slot id"
            value={slotId}
            onChange={(event) => {
              slotIdSet(event.target.value);
            }}
          />
        </Form>

        <br></br>
        <br></br>
      </EthereumContext.Provider>
    </div>
  );
}

export default App;
/**
          <br></br>
          <Form error={!!errMsg}>
            <Message error header="Error" content={errMsg} />
            <Button color="orange" loading={loading} content="setGasPrice" />
            <Input
              label="unit in GWei"
              labelPosition="right"
              placeholder="gas price"
              value={gasPrice}
              onChange={(event) => {
                setGasPrice(event.target.value);
                //checkNumeric(event.target.value, "gasPrice");
              }}
            />
          </Form>

          <br></br>
          <Form error={!!errMsg}>
            <Button color="orange" loading={loading} content="setGasLimit" />
            <Input
              label="unit in Wei"
              labelPosition="right"
              placeholder="gas limit"
              value={gasLimit}
              onChange={(event) => {
                setGasLimit(event.target.value);
                //checkNumeric(event.target.value, "gasLimit");
              }}
            />
          </Form>


          <Label>gasPrice: {0}</Label>


<div>
    <ArrayObjects arrayInputs={rewardsDB} />
  </div> 

  <br></br>
  <Header />
  <Label size={'huge'}> Under Construction </Label>
*/
// const getCurrentAccount = async (event) => {
//   event.preventDefault();
//   log1("---------== getCurrentAccount()");
//   log1("account[0]:", compo[1]);
//   const out = checkNetwork();
//   log1("out:", out.isOk, out.chainId)
//   return true;
// };

//-------------------==
//const [Approve1Va1, Approve1SetVa1] = useState("");
//const [Approve1ErrMsg, Approve1SetErrMsg]= useState("");

// const ArrayObjects = ({ arrayInputs }) => (
//   <div>
//     {arrayInputs.map((item) => (
//       <div className="item" key={item.id}>
//         id:{item.id}, rewards: {item.reward}, timestamp: {item.updatedAt}
//       </div>
//     ))}
//   </div>
// );
//-------------------==
// const checkNumeric = (inputValue, inputSource) => {
//   log1("checkNumeric", inputValue);
//   if (inputValue === "" || inputValue < 0 || isNaN(inputValue)) {
//     const errMsg =
//       "input error@ " +
//       inputSource +
//       ": amount cannot be empty, zero, negative, or non-numeric";
//     console.warn(errMsg);
//     showErr(inputSource, errMsg);
//     return false;
//   } else {
//     log1("checkNumeric Ok");
//     clearErr(inputSource);
//     return true;
//   }
// };
// const showErr = (inputSource, errMsg) => {
//   switch (inputSource) {
//     case "gasPrice":
//       setErrMsg(errMsg);
//       break;
//     case "gasLimit":
//       setErrMsg(errMsg);
//       break;
//     default:
//       console.warn("showErr: no matched inputSource");
//   }
// };
// const clearErr = (inputSource) => {
//   switch (inputSource) {
//     case "gasPrice":
//       setErrMsg("");
//       break;
//     case "gasLimit":
//       setErrMsg("");
//       break;
//     default:
//       console.warn("clearErr: no matched inputSource");
//   }
// };

// const handleDropdown_assetName = (e, { value }) => {
//   log1("assetNameDropdown value:", value);
//   //assetNameSet(value);
// };
// const handleDropdown_addrTo = (e, { value }) => {
//   log1("DropdownAddress value:", value);
//   //addrToSet(value);
// };
