import Web3 from "web3";
import { config } from "../ethereum/config";
import ERC20Token from "./ERC20Token.json";
import Rewards from "./Rewards.json";

//const log1 = console.log

//--------------------------==Rewards Contract
const stake = async (ethereumContext, amount) =>
  new Promise(async (resolve, reject) => {
    // const errorText = 'errBuyTokens';
    // this.setState({loading: true, errBuyTokens: ''});
    // if(!this.checkNumeric(this.state.amountBuyTokens, errorText)){
    //   return;
    // };
    console.log("---------== stake()");
    const [web3, accounts, instERC20, instRewards] = ethereumContext;
    const weiAmount = web3.utils.toWei(amount, "ether");
    //gas: 100000000000,  value: web3.utils.toWei(this.state.value, 'ether'
    try {
      if (instRewards !== undefined) {
        await instRewards.methods
          .stake(weiAmount)
          .send({
            from: accounts[0],
            gasPrice: 20000000000,
          })
          .on("receipt", (receipt) => {
            console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
            resolve(receipt.transactionHash);
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log("confirmation", confirmationNumber);
            //resolve(confirmationNumber);
          })
          .on("error", (err, receipt) => {
            console.log(err);
            reject(undefined);
            return false;
          });
      }
      resolve("noTxn");
    } catch (err) {
      console.log(err);
      reject(err);
      //this.setState({errGetBalance: err.message});
    }
    // .then(receipt => {
    //   console.log("txn receipt:", receipt);
    // //.transactionHash, from, to, gasUsed, status
    // }).catch(error => {
    //   console.log("error:", error);
    // });
    //this.setState({loading: false, value: ''});//reset the state values
  });

const getStakedAmount = async (ethereumContext) =>
  new Promise(async (resolve, reject) => {
    // const errorText = 'errGetBalance';
    // this.setState({errGetBalance: ''});
    console.log("---------== getStakedAmount()");
    const [web3, accounts, instERC20, instRewards] = ethereumContext;
    try {
      if (instRewards !== undefined) {
        const weiAmount = await instRewards.methods
          .balanceOf(accounts[0])
          .call();
        let stakedAmount = web3.utils.fromWei(weiAmount, "ether");
        resolve(stakedAmount);
      }
      resolve(-1);
    } catch (err) {
      console.log(err);
      reject(err);
      //this.setState({errGetBalance: err.message});
    }
  });

const getReward = async (ethereumContext) =>
  new Promise(async (resolve, reject) => {
    console.log("---------== getReward()");
    const [web3, accounts, instERC20, instRewards] = ethereumContext;
    try {
      if (instRewards !== undefined) {
        await instRewards.methods
          .getReward()
          .send({
            from: accounts[0],
            gasPrice: 20000000000,
          })
          .on("receipt", (receipt) => {
            console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
            resolve(receipt.transactionHash);
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log("confirmation", confirmationNumber);
            //resolve(confirmationNumber);
          })
          .on("error", (err, receipt) => {
            console.log(err);
            reject(undefined);
            return false;
          });
      }
      resolve("noTxn");
    } catch (err) {
      console.log(err);
      reject(err);
      //this.setState({errGetBalance: err.message});
    }
  });

const withdraw = async (ethereumContext, amount) =>
  new Promise(async (resolve, reject) => {
    console.log("---------== withdraw()");
    const [web3, accounts, instERC20, instRewards] = ethereumContext;
    try {
      if (instRewards !== undefined) {
        const weiAmount = web3.utils.toWei(amount, "ether");
        await instRewards.methods
          .withdraw(weiAmount)
          .send({
            from: accounts[0],
            gasPrice: 20000000000,
          })
          .on("receipt", (receipt) => {
            console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
            resolve(receipt.transactionHash);
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log("confirmation", confirmationNumber);
            //resolve(confirmationNumber);
          })
          .on("error", (err, receipt) => {
            console.log(err);
            reject(undefined);
            return false;
          });
      }
      resolve("noTxn");
    } catch (err) {
      console.log(err);
      reject(err);
      //this.setState({errGetBalance: err.message});
    }
  });

const exit = async (ethereumContext, amount) =>
  new Promise(async (resolve, reject) => {
    console.log("---------== exit()");
    const [web3, accounts, instERC20, instRewards] = ethereumContext;
    try {
      if (instRewards !== undefined) {
        await instRewards.methods
          .exit()
          .send({
            from: accounts[0],
            gasPrice: 20000000000,
          })
          .on("receipt", (receipt) => {
            console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
            resolve(receipt.transactionHash);
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log("confirmation", confirmationNumber);
            //resolve(confirmationNumber);
          })
          .on("error", (err, receipt) => {
            console.log(err);
            reject(undefined);
            return false;
          });
      }
      resolve("noTxn");
    } catch (err) {
      console.log(err);
      reject(err);
      //this.setState({errGetBalance: err.message});
    }
  });

const getRewardsCtrtStates = async (instRewards) =>
  new Promise(async (resolve, reject) => {
    try {
      if (typeof instRewards !== "undefined") {
        const rewardsData1 = await instRewards.methods.getData1().call();
        const rewardsData2 = await instRewards.methods.getData2().call();
        //   blockTimestamp = 0,
        // periodFinish = 0,
        // rewardRate = 0,
        // lastUpdateTime = 0,
        // rewardPerTokenStored = 0;
        console.log("rewardsData1:", rewardsData1);
        console.log("rewardsData2:", rewardsData2);
        resolve([
          rewardsData1[0],
          rewardsData1[1],
          rewardsData1[2],
          rewardsData2[0],
          rewardsData2[1],
        ]);
      }
    } catch (error) {
      console.log(error);
      reject("getRewardsCtrtStates failed");
    }
  });

// const getERC20CtrtStates = async () =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const weiAmount = await instERC20.methods.balanceOf(accounts[0]).call();
//       const usrAmount = web3.utils.fromWei(weiAmount, "ether");
//       console.log("account[0] balance:", usrAmount);
//     } catch (error) {
//       console.log(error);
//       reject("init failed");
//     }
//   });

const getERC20CtrtStates = async (web3, addr, instERC20) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("instERC20:", instERC20);
      const name = ""; //await instERC20.methods.name().call();
      const symbol = ""; //await instERC20.methods.symbol().call();
      const decimals = ""; //await instERC20.methods.decimals().call();
      const version = ""; //await instERC20.methods.version().call();
      const totalSupply = ""; //await instERC20.methods.totalSupply().call();

      const weiAmount = await instERC20.methods.balanceOf(addr).call();
      const usrAmount = web3.utils.fromWei(weiAmount, "ether");
      console.log("addr balance:", usrAmount);
      resolve([usrAmount, name, symbol, decimals, version, totalSupply]);
    } catch (error) {
      console.log(error);
      reject("getERC20CtrtStates failed");
    }
  });

const getContractStates = async (compo) =>
  new Promise(async (resolve, reject) => {
    const [web3, accounts, instERC20, instRewards] = compo;
    try {
      let erc20CtrtStates;
      if (typeof accounts !== "undefined") {
        erc20CtrtStates = await getERC20CtrtStates(
          web3,
          accounts[0],
          instERC20
        ).catch((err) => {
          console.log(`${err}`);
          reject("reading ERC20 token contract failed");
          return false;
        });
      }

      const rewardsStates = await getRewardsCtrtStates(instRewards).catch(
        (err) => {
          console.log(`${err}`);
          reject("reading Rewards contract failed");
          return false;
        }
      );
      resolve([erc20CtrtStates, rewardsStates]);
    } catch (error) {
      console.log("userEffect2:", error);
      reject("getRewardsCtrtStates failed");
    }
  });

//--------------------------==
const getWeb3 = async () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      // wait for loading completion to avoid race condition with web3 injecting timing
      if (window.ethereum) {
        //new version of MetaMask exists
        console.log("newer web3 detected");
        const web3 = new Web3(window.ethereum);
        //has provider inside
        try {
          await window.ethereum.enable();
          console.log("Acccounts now exposed");
          resolve(web3);
        } catch (error) {
          console.warn("User denied account access");
          reject(error);
        }
      } else if (window.web3) {
        //other wallet or older web3
        const web3 = window.web3;
        //const web3 = new Web3(window.web3.currentProvider);
        console.log("older web3 detected");
        resolve(web3);
      } else if (config.mode === "1") {
        const provider = new Web3.providers.HttpProvider(config.infuraEndpoint);
        const web3 = new Web3(provider);
        console.log("no web3 injected. Use infura endpoint");
        resolve(web3);
      } else {
        const provider = new Web3.providers.HttpProvider(config.localEndpoint);
        const web3 = new Web3(provider);
        console.log("no web3 injected. Use local web3");
        resolve(web3);
      }
    });
  });

const init = async () =>
  new Promise(async (resolve, reject) => {
    let mesg, network1;
    try {
      const web3 = await getWeb3().catch((err) => {
        reject(err);
      });
      if (typeof web3 === "undefined") {
        console.log("missing web3:", web3, typeof web3);
        reject("missing web3");
      }

      const isMetaMask = await web3.currentProvider.isMetaMask;
      console.log("isMetaMask", isMetaMask);
      if (!isMetaMask) {
        mesg = "Please install MetaMask browser extension";
        console.log(mesg);
        reject(mesg);
      }

      const accounts = await web3.eth.getAccounts();
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ctrtX.networks[networkId];
      if (!Array.isArray(accounts) || accounts.length === 0) {
        mesg = "missing accounts";
        console.log(
          "missing accounts:",
          accounts,
          Array.isArray(accounts),
          accounts.length
        );
        reject(mesg);
      }
      if (accounts[0] === undefined) {
        mesg = "Please login to MetaMask(ETH wallet)";
        console.log(mesg);
        reject(mesg);
      }

      await web3.eth.net.getNetworkType((err, network) => {
        if (err === null) {
          network1 = network;
        } else {
          network1 = "network not found";
        }
      });
      //console.log('network', network1);
      if (network1 === "network not found") {
        mesg = network1;
        console.log(mesg);
        reject(mesg);
      } else if (network1 === "rinkeby" || network1 === "mainnet") {
        console.log(`${network1} network is allowed`);
      } else {
        mesg = "incorrect network";
        console.log(mesg);
        reject(mesg);
      }

      const instERC20 = new web3.eth.Contract(
        ERC20Token.abi,
        config.erc20TokenAddress
      ); //deployedNetwork && deployedNetwork.address,
      if (typeof instERC20 === "undefined") {
        console.log("missing instERC20:", instERC20);
        reject("missing instERC20");
      }

      const instRewards = new web3.eth.Contract(
        Rewards.abi,
        config.rewardsAddress
      );
      if (typeof instRewards === "undefined") {
        console.log("missing instRewards:", instRewards);
        reject("missing instRewards");
      }

      console.log("init is successful");
      resolve([web3, accounts, instERC20, instRewards]);
    } catch (error) {
      console.log(error);
      reject("init failed");
    }
  });

//module.exports =
export {
  init,
  getContractStates,
  getRewardsCtrtStates,
  getERC20CtrtStates,
  stake,
  getStakedAmount,
};
