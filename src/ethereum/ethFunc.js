import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, BigNumber } from "ethers"; //BigNumber
import Web3 from "web3";
import { config } from "../ethereum/config";
import ABI_ERC20FixedSupply from "./ABI_ERC20FixedSupply.json";
import ABI_SalesCtrt from "./ABI_SalesCtrt.json";

//import { rewardsCtrtIdxes, dbSelections } from "./config";
// const instance = new web3.eth.Contract(
//     JSON.parse(NFTokenMetadataEnumerable.interface),
//     '0xe6Da20c6F3ba3ac86C7FA3da155E5847F3cDE7e6'
// );
// export default instance;
//--------------------------== utils
export const log1 = console.log;
//const bigNum = (item) => BigNumber.from(item);

//const dp = 18;
//const base = bigNum(10).pow(dp);
//const SECONDS_IN_A_DAY = 86400;
//const one1 = constants.One;
//const bnOne = bigNum(one1);
//const MAX_INTEGER = new bigNum(2).pow(new bigNum(256)).sub(new bigNum(1));
//const OptionType = { Put: 1, Call: 2 };
export const addr0 = "0x0000000000000000000000000000000000000000";

//const amp = 1000000;
export const GWEI = 1000000000;

export const fromWeiE = (weiAmount, dp = 18) => {
  try {
    return ethers.utils.formatUnits(weiAmount, parseInt(dp));
  } catch (err) {
    console.error("fromWeiE() failed:", err);
    return -1;
  }
}; //input: BN or string, dp = 6 or 18 number, output: string

export const toWeiE = (amount, dp = 18) => {
  try {
    return ethers.utils.parseUnits(amount, parseInt(dp));
  } catch (err) {
    console.error("toWeiE() failed:", err);
    return -1;
  }
}; //input: string, output: Bn

export const fromWei = (weiAmount) => fromWeiE(weiAmount);
//web3.utils.fromWei(weiAmount.toString(), "ether");

export const toWei = (amount) => toWeiE(amount);
//web3.utils.toWei(amount.toString(), "ether");

//--------------------------==
export const extractCompo = async (compo, ctrtNum, acctIdx) => {
  //log1("compo:", compo);
  if (compo === undefined) {
    console.error("compo is undefined");
    return [-1];
  }
  if (ctrtNum === undefined) {
    console.error("ctrtNum is undefined");
    return [-1];
  }
  if (compo.length < 2) {
    console.error("compo is not complete");
    return [-1];
  }
  const instContracts = compo[3];
  if (instContracts === undefined) {
    console.error("instContracts undefined");
  } else if (instContracts.length < 2) {
    console.error("instContracts length is less than 3");
  }
  const instERC20FixedSupply = instContracts[0];
  const instSalesCtrt = instContracts[1];

  if (Number.isInteger(acctIdx) && parseInt(Number(acctIdx)) >= 0) {
    //const addr1 = await getAccounts(compo[0]);
    const acctX = compo[1][acctIdx];
    //console.log("acctX:", acctX);

    if (ctrtNum === 2) {
      return [instERC20FixedSupply, acctX];
    } else if (ctrtNum === 1) {
      return [instSalesCtrt, acctX];
    } else {
      return [instSalesCtrt, acctX];
    }
  } else {
    if (ctrtNum === 2) {
      return [instERC20FixedSupply];
    } else if (ctrtNum === 1) {
      return [instSalesCtrt];
    } else {
      return [instSalesCtrt];
    }
  }
};

export const func = async (compo) =>
  new Promise(async (resolve, reject) => {
    resolve(-1);
  });

//let stakedAmount  = fromWeiE(weiAmount, dp);

// const err1 = checkDropdown(network1, rewardsCtrtIndex);
// if (err1) {
//   reject(err1);
// }

//---------------------== utility function
const getEthNodeURL = async () =>
  new Promise(async (resolve, reject) => {
    const ctrtNum = config.contractGroupId;
    if (ctrtNum === 1) {
      resolve(config.ethNodeURL1);
    } else if (ctrtNum === 4) {
      resolve(config.ethNodeURL4);
    } else if (ctrtNum === 42) {
      resolve(config.ethNodeURL42);
    } else {
      console.error("ethNodeNumber is invalid");
      reject("ethNodeNumber is invalid");
    }
  });

export const getGasData = async () =>
  new Promise(async (resolve, reject) => {
    log1("---------== getGasData()");
    const url = config.gasDataSource;
    const isToAcceptOpaqueRes = false;
    const response = await fetch(url).catch((err) => {
      log1("err@ fetch:", err);
      reject(false);
    });
    log1("response:", response);
    if (response && response.ok) {
      let resObj = await response.json();
      log1("resObj:", resObj);
      const gasPriceNew = resObj.result.ProposeGasPrice;
      log1("ProposeGasPrice:", gasPriceNew);
      resolve(gasPriceNew);
    } else if (isToAcceptOpaqueRes) {
      let data = await response.text();
      log1("ProposeGasPrice:", data);
      resolve(data ? JSON.parse(data) : {});
    } else {
      reject(false);
    }
  });

//--------------------------==
export const getProviderSignerAfLoad = async () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      // wait for loading completion to avoid race condition with web3 injecting timing
      if (window.ethereum) {
        //new version of MetaMask exists
        log1("newer ehereum detected");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        resolve(provider, signer);
      } else {
        const ethNodeURL = await getEthNodeURL().catch((err) => {
          reject(err);
        });
        log1("using ethNodeURL:", ethNodeURL);
        const provider = new ethers.providers.JsonRpcProvider(ethNodeURL);
        log1("no ethereum injected. Use infura endpoint");
        const signer = provider.getSigner();
        resolve(provider, signer);
      }
    });
  });

export const getWeb3AfLoad = async () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      // this addEventListener is only needed if you run this getWeb3AfLoad when the website loads up... wait for loading completion to avoid race condition with web3 injecting timing

      const provider = await detectEthereumProvider();
      if (provider) {
        //new version of MetaMask exists
        log1("newer ehereum detected");
        // From now on, this should always be true:
        // provider === window.ethereum
        // Access the decentralized web!
        // Legacy providers may only have ethereum.sendAsync

        const web3 = new Web3(provider);
        //has provider inside
        await provider
          .request({
            method: "eth_requestAccounts",
          })
          .catch((err) => {
            console.warn(
              "User denied account access or error occurred @ provider.request:",
              err
            );
            reject(err);
          });
        log1(
          "Acccounts now exposed",
          "ethereum.selectedAddress",
          provider.selectedAddress
        );
        resolve(web3);
      } else if (window.web3) {
        //other wallet or older web3
        const web3 = window.web3;
        //const web3 = new Web3(window.web3.currentProvider);
        log1("older web3 detected");
        resolve(web3);
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error("Please install MetaMask!");

        const ethNodeURL = await getEthNodeURL().catch((err) => {
          reject(err);
        });
        log1("using ethNodeURL:", ethNodeURL);
        const provider = new Web3.providers.HttpProvider(ethNodeURL);
        const web3 = new Web3(provider);
        log1("no web3 injected. Use infura endpoint");
        resolve(web3);
      }
    });
  });

export const getWeb3 = async () =>
  new Promise(async (resolve, reject) => {
    //window.addEventListener("load", async () => {
    // wait for loading completion to avoid race condition with web3 injecting timing

    const provider = await detectEthereumProvider();
    if (provider) {
      //new version of MetaMask exists
      log1("newer ehereum detected");
      // From now on, this should always be true:
      // provider === window.ethereum
      // Access the decentralized web!
      // Legacy providers may only have ethereum.sendAsync

      const web3 = new Web3(provider);
      //has provider inside
      await provider
        .request({
          method: "eth_requestAccounts",
        })
        .catch((err) => {
          console.warn(
            "User denied account access or error occurred @ provider.request:",
            err
          );
          reject(err);
        });
      log1(
        "Acccounts now exposed",
        "ethereum.selectedAddress",
        provider.selectedAddress
      );
      resolve(web3);
    } else if (window.web3) {
      //other wallet or older web3
      const web3 = window.web3;
      //const web3 = new Web3(window.web3.currentProvider);
      log1("older web3 detected");
      resolve(web3);
    } else {
      // if the provider is not detected, detectEthereumProvider resolves to null
      console.error("Please install MetaMask!");

      const ethNodeURL = await getEthNodeURL().catch((err) => {
        reject(err);
      });
      log1("using ethNodeURL:", ethNodeURL);
      const provider = new Web3.providers.HttpProvider(ethNodeURL);
      const web3 = new Web3(provider);
      log1("no web3 injected. Use infura endpoint");
      resolve(web3);
    }
    //});
  });

export const init = async () =>
  new Promise(async (resolve, reject) => {
    let mesg;
    console.log("init()");
    try {
      //const web3 = await getWeb3().
      const web3 = await getWeb3AfLoad().catch((err) => {
        reject(err);
        return false;
      });
      if (typeof web3 === "undefined") {
        log1("missing web3:", web3, typeof web3);
        reject("missing web3");
        return false;
      }
      log1("web3 version:", web3.version);

      const isMetaMask = await web3.currentProvider.isMetaMask;
      log1("isMetaMask", isMetaMask);
      if (!isMetaMask) {
        mesg = "Please install MetaMask browser extension";
        log1(mesg);
        reject(mesg);
        return false;
      }

      const accounts = await web3.eth.getAccounts();
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ctrtX.networks[networkId];
      if (!Array.isArray(accounts) || accounts.length === 0) {
        mesg = "missing accounts";
        log1(
          "missing accounts:",
          accounts,
          Array.isArray(accounts),
          accounts.length
        );
        reject(mesg);
        return false;
      }
      if (accounts[0] === undefined) {
        mesg = "Please login to MetaMask(ETH wallet)";
        log1(mesg);
        reject(mesg);
        return false;
      }
      console.log("accounts:", accounts);

      const chainId = parseInt(window.ethereum.chainId, 16);
      console.log("chainId:", chainId);
      if (chainId === 77) {
        log1("chainId 77 for xDai Testnet detected");
      } else if (chainId === 1) {
        log1("chainId 1 for Ethereum Mainnet detected");
      } else if (chainId === 4) {
        log1("chainId 4 for Ethereum Rinkeby detected");
      } else if (chainId === 42) {
        log1("chainId 42 for Ethereum Kovan detected");
      } else {
        mesg = "chainId invalid";
        reject(mesg);
        return false;
      }

      const [addrSalesCtrt, addrERC20FixedSupply] = await getCtrtAddresses();
      console.log(
        "addrSalesCtrt:",
        addrSalesCtrt,
        ", addrERC20FixedSupply:",
        addrERC20FixedSupply
      );

      const instSalesCtrt = new web3.eth.Contract(
        ABI_SalesCtrt.abi,
        addrSalesCtrt
      );
      const instERC20FixedSupply = new web3.eth.Contract(
        ABI_ERC20FixedSupply.abi,
        addrERC20FixedSupply
      );
      if (typeof instSalesCtrt === "undefined") {
        log1("missing instSalesCtrt:", instSalesCtrt);
        reject("missing instSalesCtrt");
        return false;
      }
      if (typeof instERC20FixedSupply === "undefined") {
        log1("missing instERC20FixedSupply:", instERC20FixedSupply);
        reject("missing instERC20FixedSupply");
        return false;
      }
      const instContracts = [instERC20FixedSupply, instSalesCtrt];

      log1("init is successful");
      resolve(["web3", accounts, chainId, instContracts]);
    } catch (error) {
      log1(error);
      reject("init failed");
    }
  });

export const getCtrtAddresses = async () =>
  new Promise(async (resolve, reject) => {
    const ctrtNum = config.contractGroupId;
    let ctrtAddrs;
    if (ctrtNum === 77) {
    } else if (ctrtNum === 100) {
      ctrtAddrs = [];
      resolve(ctrtAddrs);
    } else if (ctrtNum === 42) {
      ctrtAddrs = [config.SalesCtrt_Kovan, config.ERC20FixedSupply_Kovan];
      resolve(ctrtAddrs);
    } else if (ctrtNum === 4) {
      ctrtAddrs = [];
      resolve(ctrtAddrs);
    } else if (ctrtNum === 1) {
      ctrtAddrs = [];
      resolve(ctrtAddrs);
    } else {
      console.error("contractGroupId is invalid");
      reject("contractGroupId is invalid");
    }
  });
