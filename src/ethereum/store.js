import { ethers, BigNumber} from "ethers"; //BigNumber
//import { config } from "./config";
import {extractCompo, toWei, fromWei, GWEI, addr0, getCtrtAddresses, getGasData, fromWeiE,  } from "./ethFunc";

//--------------------------==
//--------------------------== Token Contract
export const BalanceOf = async (compo, userAddr) =>
  new Promise(async (resolve, reject) => {
    console.log("---------== BalanceOf()");
    const [instERC20FixedSupply, acct0] = await extractCompo(compo, 2, 0);

    if (instERC20FixedSupply === undefined || acct0 === undefined) {
      resolve(-1);
      return false;
    }

    if (userAddr === undefined || userAddr === "") {
      userAddr = acct0;
      console.log("using default accounts[0]");
    }
    console.log("userAddr:", userAddr);
    try {
      const data = await instERC20FixedSupply.methods
        .balanceOf(userAddr)
        .call();
      console.log("data:", data);
      resolve(data);
    } catch (err) {
      console.error("BalanceOf() failed.", err);
      reject(-1);
    }
  });


//--------------------------== ARK Contract
export const ReadARKFunc = async (compo) =>
new Promise(async (resolve, reject) => {
  console.log("---------== ReadARKFunc()");
  const [instERC20FixedSupply, acct0] = await extractCompo(compo, 0, 0);
  if (instERC20FixedSupply === undefined) {
    resolve(-1);
  }
  try {
    const data = await instERC20FixedSupply.methods.name().call();
    console.log("data:", data);
    resolve(data);
  } catch (err) {
    console.error("ReadFunc() failed.", err);
    reject(-1);
  }
});


export const transferToken = async (compo, gasPrice, gasLimit, addrTo, amountWei) => new Promise(async (resolve, reject) => {
  console.log("---------== transferToken()");
  const [instERC20FixedSupply, addrFrom] = await extractCompo(compo, 2, 0);

  try {
    if (instERC20FixedSupply !== undefined && addrFrom !== "") {
      const isAvailable = true;
      if(!isAvailable){
        console.log("tokenId not available");
        reject("tokenId not available");
        return false;
      }
      //const value1= web3.utils.toWei('0.1', "ether");
      console.log("addrFrom:", addrFrom, ", addrTo:", addrTo, ", amountWei:", amountWei, ", gasPrice:", gasPrice, ", gasLimit:", gasLimit);
    
      await instERC20FixedSupply.methods
        .transfer(addrTo, amountWei)
        .send({
          from: addrFrom,
          gasPrice: gasPrice * GWEI,
          gas: gasLimit,
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("err@transferToken:", err);
          reject(err);
          return false;
        });
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

//--------------------------== SalesCtrt
export const ReadSalesCtrt = async (compo) => new Promise(async (resolve, reject) => {
  console.log("---------== ReadSalesCtrt()");
  const [instSalesCtrt, addrFrom] = await extractCompo(compo, 1, 0);
  const slotId = 1;
  try {
    if (instSalesCtrt !== undefined && addrFrom !== "") {
      const slotPrices1 = await instSalesCtrt.methods.slotPrices(slotId).call();
      const slotPrices1ETH = fromWei(slotPrices1);
      resolve(slotPrices1ETH);
    } else {
      console.log("addr:", addrFrom);
      console.error("instSalesCtrt or addrFrom invalid")
    }
  } catch (err) {
    console.error("err@ReadSalesCtrt:", err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});


export const buyViaToken = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  console.log("---------== buyViaToken()");
  const [instSalesCtrt, addrFrom] = await extractCompo(compo, 1, 0);

  try {
    if (instSalesCtrt !== undefined && addrFrom !== "") {
      // const addrNFTContract = await instSalesCtrt.methods.addrNFTContract().call();
      // console.log("addrNFTContract:",addrNFTContract );
      const isAvailable = true;
      if(!isAvailable){
        console.log("tokenId not available");
        reject("tokenId not available");
        return false;
      }

      const slotPrices1 = await instSalesCtrt.methods.slotPrices1().call();
      //const value1= web3.utils.toWei('0.1', "ether");

      console.log("addrFrom:", addrFrom, ", gasPrice:", gasPrice, ", gasLimit:", gasLimit, tokenId, slotPrices1, typeof slotPrices1 );
    
      await instSalesCtrt.methods
        .buyViaToken(tokenId)
        .send({
          from: addrFrom,
          value: slotPrices1,
          gasPrice: gasPrice * GWEI,
          gas: gasLimit,
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("err@buyViaToken:", err);
          const result = await buyViaTokenCheck(compo, gasPrice, gasLimit, tokenId).catch((err) => {
            console.error("err@buyViaTokenCheck:", err)
            reject(err);
            return false;
          });;
          console.log("buyViaTokenCheck result:", result);
          reject(err);
          return false;
        });
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

export const buyViaTokenCheck = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  console.log("---------== buyViaETHCheck()");
  const [instSalesCtrt, addrFrom] = await extractCompo(compo, 1, 0);

  console.log("addrFrom:", addrFrom, gasPrice, gasLimit, tokenId);
  try {
    if (instSalesCtrt !== undefined && addrFrom !== "") {
      const result = await instSalesCtrt.methods
        .BuyNFTViaETHCheck(tokenId)
        .call({from: addrFrom});
        resolve(result);
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});


//-----------------------==
export const buyViaETH = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  console.log("---------== buyViaETH()");
  const [instSalesCtrt, addrFrom] = await extractCompo(compo, 1, 0);

  try {
    if (instSalesCtrt !== undefined && addrFrom !== "") {
      // const addrNFTContract = await instSalesCtrt.methods.addrNFTContract().call();
      // console.log("addrNFTContract:",addrNFTContract );
      const isAvailable = true;
      if(!isAvailable){
        console.log("tokenId not available");
        reject("tokenId not available");
        return false;
      }

      const slotPrices1 = await instSalesCtrt.methods.slotPrices1().call();
      //const value1= web3.utils.toWei('0.1', "ether");

      console.log("addrFrom:", addrFrom, ", gasPrice:", gasPrice, ", gasLimit:", gasLimit, tokenId, slotPrices1, typeof slotPrices1 );
    
      await instSalesCtrt.methods
        .buyViaETH(tokenId)
        .send({
          from: addrFrom,
          value: slotPrices1,
          gasPrice: gasPrice * GWEI,
          gas: gasLimit,
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("err@buyViaETH:", err);
          const result = await buyViaETHCheck(compo, gasPrice, gasLimit, tokenId).catch((err) => {
            console.error("err@buyViaETHCheck:", err)
            reject(err);
            return false;
          });;
          console.log("buyViaETHCheck result:", result);
          reject(err);
          return false;
        });
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

export const buyViaETHCheck = async (compo, gasPrice, gasLimit, tokenId) => new Promise(async (resolve, reject) => {
  console.log("---------== buyViaETHCheck()");
  const [instSalesCtrt, addrFrom] = await extractCompo(compo, 1, 0);

  console.log("addrFrom:", addrFrom, gasPrice, gasLimit, tokenId);
  try {
    if (instSalesCtrt !== undefined && addrFrom !== "") {
      const result = await instSalesCtrt.methods
        .BuyNFTViaETHCheck(tokenId)
        .call({from: addrFrom});
        resolve(result);
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});

export const withdrawToken = async (compo, gasPrice, gasLimit, addrTo, amountWei) => new Promise(async (resolve, reject) => {
  console.log("---------== withdrawToken()");
  const [instSalesCtrt, addrFrom] = await extractCompo(compo, 1, 0);

  try {
    if (instSalesCtrt !== undefined && addrFrom !== "") {
      const isAvailable = true;
      if(!isAvailable){
        console.log("tokenId not available");
        reject("tokenId not available");
        return false;
      }
      //const value1= web3.utils.toWei('0.1', "ether");
      console.log("addrFrom:", addrFrom, ", addrTo:", addrTo, ", amountWei:", amountWei.toString(), ", gasPrice:", gasPrice, ", gasLimit:", gasLimit);
    
      await instSalesCtrt.methods
        .withdrawToken(addrTo, amountWei.toString())
        .send({
          from: addrFrom,
          gasPrice: gasPrice * GWEI,
          gas: gasLimit,
        })
        .on("receipt", (receipt) => {
          console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
          resolve(receipt.transactionHash);
        })
        .on("error", async(err, receipt) => {
          console.error("err@withdrawToken:", err);
          reject(err);
          return false;
        });
    } else {
      resolve("contract instance or addrFrom invalid");
    }
  } catch (err) {
    console.error(err);
    reject(err);
    //this.setState({errGetBalance: err.message});
  }
});
