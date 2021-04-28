import React, { Component } from 'react';
import { Form, Input, Message, Card, Button, Grid, Segment,Header } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import web3 from '../ethereum/web3';

import instData1 from '../ethereum/NFTokenMetadataEnumerable';
//0xe6Da20c6F3ba3ac86C7FA3da155E5847F3cDE7e6

//import instLogic1 from '../ethereum/HeartLogic';
//import instSalesICO from '../ethereum/SalesICO';
//import styled from 'styled-components';
//https://medium.com/coinmonks/react-web-dapp-with-metamask-web3-sotp-part-4-f252ebe8d07f
//use Web3 library constructor to make a new instance of web3

/*
0xF694dCbec7f434dE9F892cfACF0449DB8661334D  owner...

//Use Uppercases for component names
Path
/                             List of Campaigns
/campaigns/new                Form to make a campaign
/campaigns/0x8147             0x8147 campaign details
/campaigns/0x8147/requests    0x8147 campaign requests
/campaigns/0x8147/requests/new    Form to make a request for 0x8147 campaign

0x8764192FDBd1f01f135ff3d73797bE97FF6b82Ac
0x4fCb2bE49B0a66b335aCa109B6A1D8b2869c0543
0xa543322142A2Fea599e1181418CF4C6999bd5D1b
*/

class MainIndex extends Component {
  state = {// only in class based components
    errorMessage: '', loading: false, 
    account: '', isLocked: '', isLockRemoved: '', 
    accountToCheck: '', outTokenCountTo: '', outTokenCountFrom: '',
    owner: '', name: '', symbol: '', totalSupply: '', 
    user: '', from: '', to: '', spender: '', data: '', tokenFallback: '',
    balanceETH: '', balanceNFT: '', approved: '', result: '', 
    balanceTo: '', balanceFrom: '', tokenNameN: '', 
    mint_tokenURI: '', tokenId: '', indx1: '', NthTokenID: '',
    addr1: '0xf694dcbec7f434de9f892cfacf0449db8661334d', addr1tmp: '', addr2tmp: '', addr3tmp: '',
    addr2: '0x4424a1eA106024AF74a9934B04b5e03fEEEFB9a8',
    addr3: '0x2cbD1A07f4c3f65C06609695cCB6C0Ec144935CE',
    errGetTokenDetail: '', errAccountDetail: '', errTransfer: '', errApprove: '',
    errTransferFrom3: '', errMintNFT: '', errBurnNFT: '', errGetNthTokenID: '', errIsOperator: '',
    errSetAccounts: '', errBuyTokens: '', amountBuyTokens: '', yesApprovedForAll: '',
    balanceETHd18: '', balanceToD18: '', balanceFromD18: '', boolValue: '', operator: '', 
    isOperator: '',
    tokenId_Show: false, account_show: false,
  }//when starting a new project, delete usage of deleted state properties or get undefined error
  //add smart contract inputs as new state properties

  static async getInitialProps() {
    console.log('getInitialProps');
    const name = await instData1.methods.name().call();
    const symbol = await instData1.methods.symbol().call();
    console.log('name', name, 'symbol', symbol);
    return {name, symbol};
  }

  async componentDidMount() {
    console.log('\ncomponentDidMount');
    let balanceETH; let balanceNFT; let balanceETHd18;
    let isMetaMask = await web3.currentProvider.isMetaMask;
    console.log('isMetaMask',isMetaMask);
    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    console.log('account', account);
    if(!isMetaMask){
			account = 'Please install MetaMask browser extension';
      balanceETH = 'n/a'; balanceNFT = 'n/a'; balanceETHd18 = 'n/a';
		} else if (account === undefined){
      account = 'Please login to Eth wallet';
      balanceETH = 'n/a'; balanceNFT = 'n/a'; balanceETHd18 = 'n/a';
    } else {
      balanceETH = await web3.eth.getBalance(account);
      balanceNFT = await instData1.methods.balanceOf(account).call();
      console.log('set balanceETH');
      balanceETHd18 = web3.utils.fromWei(balanceETH, "ether");
    }
    console.log('balanceETH in wei', balanceETH, 'balanceNFT in wei', balanceNFT);
    console.log('balanceETHd18', balanceETHd18);
    let network1; let networkText = '';
    await web3.eth.net.getNetworkType((err, network)=>  {
      if (err === null) {
        network1 = network;
      } else {
        network1 = 'network not found';
      }}
    );
    console.log('network', network1);
    if (network1 !== 'rinkeby') {networkText= '... [Error] Incorrect network';}

    const owner = await instData1.methods.owner().call();
    const totalSupply = await instData1.methods.totalSupply().call();

    console.log('account', account, 'balanceETH', balanceETH, 'network', network1, 'networkText', networkText, 'balanceNFT', balanceNFT, 'name', this.props.name, 'symbol', this.props.symbol, 'owner', owner, 'totalSupply', totalSupply);
    
    this.setState({account: account, balanceETH: balanceETH, network: network1, networkText: networkText, balanceNFT: balanceNFT, owner: this.props.owner, name: this.props.name, symbol: this.props.symbol, totalSupply: this.props.totalSupply, balanceETHd18: balanceETHd18, owner: owner, totalSupply: totalSupply});

  }//heartTokenDetails: this.props.heartTokenDetails


  checkAddress = (inputValue, inputErrStr) => {
    console.log("checkAddress()", inputValue);
    let boolValue = Boolean(inputValue === '' || inputValue.length > 42);
    let errMesg = 'Error: input address length cannot be empty or > 42!';

    if (boolValue) {
      // errGetTokenDetail: '', errAccountDetail: '', errTransfer: '', errIsOperator: '', errApprove: '',
      // errTransferFrom3: '', errMintNFT: '', errSetAccounts: '',
      console.warn(errMesg);
      if (inputErrStr==='errGetTokenDetail'){
        this.setState({loading: false, value: '', errGetTokenDetail: errMesg});
      } else if (inputErrStr==='errAccountDetail'){
        this.setState({loading: false, value: '', errAccountDetail: errMesg});
      } else if (inputErrStr==='errTransfer'){
        this.setState({loading: false, value: '', errTransfer: errMesg});
      } else if (inputErrStr==='errIsOperator'){
        this.setState({loading: false, value: '', errIsOperator: errMesg});
      } else if (inputErrStr==='errApprove'){
        this.setState({loading: false, value: '', errApprove: errMesg});
      } else if (inputErrStr==='errTransferFrom3'){
        this.setState({loading: false, value: '', errTransferFrom3: errMesg});
      } else if (inputErrStr==='errMintNFT'){
        this.setState({loading: false, value: '',errMintNFT: errMesg});
      } else if (inputErrStr==='errSetAccounts'){
        this.setState({loading: false, value: '',errSetAccounts: errMesg});
      }
      return false;
    } else {
      console.log('checkAddress Ok', inputValue);
      if (this.state.errorMessage !== '') {this.setState({errorMessage: ''});
      } else if (this.state.errGetTokenDetail !== '') {this.setState({errGetTokenDetail: ''});
      } else if (this.state.errAccountDetail !== '') {this.setState({errAccountDetail: ''});
      } else if (this.state.errTransfer !== '') {this.setState({errTransfer: ''});
      } else if (this.state.errIsOperator !== '') {this.setState({errIsOperator: ''});
      } else if (this.state.errApprove !== '') {this.setState({errApprove: ''});
      } else if (this.state.errTransferFrom3 !== '') {this.setState({errTransferFrom3: ''});
      } else if (this.state.errMintNFT !== '') {this.setState({errMintNFT: ''});
      } else if (this.state.errSetAccounts !== '') {this.setState({errSetAccounts: ''});
      }
      return true;
    }
  };


  checkBooleanValue = (inputValue, inputErrStr) => {
    console.log("checkBooleanValue()", inputValue);
    let errMesg = 'Error: the boolean checker';
    const isTrue = (inputValue === 'true');
    if (!isTrue) {
      console.warn(errMesg);
      if (inputErrStr==='errTransferFrom3'){
        this.setState({loading: false, value: '', errTransferFrom3: errMesg});
      } else if (inputErrStr==='errApprove'){
        this.setState({loading: false, value: '', errApprove: errMesg});
      } else if (inputErrStr==='errSetApprovalForAll'){
        this.setState({loading: false, value: '',errSetApprovalForAll: errMesg});
      }
      return false;
    } else {
      console.log('checkBooleanValue Ok', inputValue);
      if (this.state.errorMessage !== '') {this.setState({errorMessage: ''});
      } else if (this.state.errTransferFrom3 !== '') {this.setState({errTransferFrom3: ''});
      } else if (this.state.errApprove !== '') {this.setState({errApprove: ''});
      } else if (this.state.errSetApprovalForAll !== '') {this.setState({errSetApprovalForAll: ''});
      }
      return true;
    }
  };


  checkAddressNotEmpty = (inputValue) => {
    console.log("checkAddressNotEmpty", inputValue);
    if (inputValue.length === ''){
      console.warn('input address length === 0 !!!', inputValue);
      return false;
    } else {
      console.log('checkAddressNotEmpty Ok', inputValue);
      return true;
    }
  }

  checkNumeric = (inputValue, inputErrStr) => {
    console.log("checkNumeric", inputValue);
    if(inputValue === ''||inputValue < 0||isNaN(inputValue)) {
      const errMesg = 'error. amount cannot be empty, zero, negative, or non-numeric';
      console.warn(errMesg);
      if (inputErrStr==='errBuyTokens'){
        this.setState({loading: false, value: '', errBuyTokens: errMesg});
      } else if (inputErrStr==='errTransfer'){
        this.setState({loading: false, value: '', errTransfer: errMesg});
      } else if (inputErrStr==='errApprove'){
        this.setState({loading: false, value: '', errApprove: errMesg});
      } else if (inputErrStr==='errTransferFrom3'){
        this.setState({loading: false, value: '', errTransferFrom3: errMesg});
      } else if (inputErrStr==='errMintNFT'){
        this.setState({loading: false, value: '', errMintNFT: errMesg});
      }
      return false;
    } else {
      console.log("checkNumeric Ok", inputValue);
      if (this.state.errBuyTokens !== '') {this.setState({errBuyTokens: ''});
      } else if (this.state.errTransfer !== '') {this.setState({errTransfer: ''});
      } else if (this.state.errApprove !== '') {this.setState({errApprove: ''});
      } else if (this.state.errTransferFrom3 !== '') {this.setState({errTransferFrom3: ''});
      } else if (this.state.errMintNFT !== '') {this.setState({errMintNFT: ''});
      }
      return true;
    };
  }


  getAccount = async event => {
    let balanceETH; let balanceNFT; let balanceETHd18;
    let isMetaMask = await web3.currentProvider.isMetaMask;
    console.log('isMetaMask',isMetaMask);
    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    console.log('account', account);
    if(!isMetaMask){
			account = 'Please install MetaMask browser plugin';
      balanceETH = 'n/a'; balanceNFT = 'n/a'; balanceETHd18 = 'n/a';
    } else if (account === undefined){
      account = 'Please login to Eth wallet';
      balanceETH = 'n/a'; balanceNFT = 'n/a'; balanceETHd18 = 'n/a';
    } else {
      balanceETH = await web3.eth.getBalance(account);
      balanceNFT = await instData1.methods.balanceOf(account).call();
      console.log('set balanceETH');
      balanceETHd18 = web3.utils.fromWei(balanceETH, "ether");
    }
    console.log('balanceETH', balanceETH, 'balanceNFT', balanceNFT);
    console.log('balanceETHd18', balanceETHd18);

    let network1; let networkText;
    await web3.eth.net.getNetworkType((err, network)=>  {
      if (err === null) {
        network1 = network;
      } else {
        network1 = 'network not found';
      }}
    );
    console.log('network', network1);
    if (network1 !== 'rinkeby') {networkText= '... [Error] Incorect network';}
    this.setState({account: account, balanceETH: balanceETH, network: network1, networkText: networkText, balanceNFT: balanceNFT, balanceETHd18: balanceETHd18});
  };

  hideTokenDetail = async event => {
    event.preventDefault();
    console.log('inside hideTokenDetail()');
    this.setState({tokenId_Show: false});
  }

  getTokenDetail = async event => {
    event.preventDefault();
    const errorText = 'errGetTokenDetail';
    this.setState({errGetTokenDetail: ''});
    console.log('inside getTokenDetail()');
    const tokenId = this.state.tokenId;
    if(!this.checkAddress(tokenId, errorText)) {
      return;
    };

    try {
      const outTokenID_tokenOwner = await instData1.methods.ownerOf(tokenId).call();
      const outTokenID_tokenURI = await instData1.methods.tokenURI(tokenId).call();
      const approved = await instData1.methods.getApproved(tokenId).call();
      console.log('outTokenID_tokenOwner', outTokenID_tokenOwner, 'outTokenID_tokenURI', outTokenID_tokenURI, 'approved', approved);

      this.setState({outTokenID_tokenOwner: outTokenID_tokenOwner, outTokenID_tokenURI: outTokenID_tokenURI, approved: approved, tokenId_Show: true});
    } catch (err) {
      this.setState({errGetTokenDetail: err.message});
    }
  };
  //----------------------
    // let errMesg = '';
    // if (!this.checkAddress(this.state.accountToCheck)){
    //   errMesg += 'Input address length cannot be > 42!; ';
    // } else if (!this.checkAddressNotEmpty(this.state.accountToCheck)) {
    //   errMesg += 'Input address cannot be empty; ';
    // }
    // if (errMesg === '') {
    //   this.setState({errGetTokenDetail: ''});
    // } else {
    //   this.setState({loading: false, value: '', errGetTokenDetail: errMesg});
    //   return;
    // }

  checkAccount = async event => {
    event.preventDefault();
    const errorText = 'errAccountDetail';
    this.setState({loading: true, errAccountDetail: ''});
    console.log('checkAccount()', this.state.accountToCheck);
    if(!this.checkAddress(this.state.accountToCheck, errorText)) {
      return;
    };

    try {
      const outTokenCountTo = await instData1.methods.balanceOf(this.state.accountToCheck).call();
      console.log('outTokenCountTo', outTokenCountTo);
      this.setState({outTokenCountTo: outTokenCountTo, account_show: true});
    } catch (err) {
      console.warn('error');
      this.setState({errAccountDetail: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };


  //------------------------------==calling smart contract write functions
  //------------------------------==
  buyTokens = async event => {
    event.preventDefault();
    const errorText = 'errBuyTokens';
    this.setState({loading: true, errBuyTokens: ''});
    if(!this.checkNumeric(this.state.amountBuyTokens, errorText)){
      return;
    };
    const amountToSend = web3.utils.toWei(this.state.amountBuyTokens, "ether");
    console.log('from', accounts[0], 'value', amountToSend);
    try {
      const accounts = await web3.eth.getAccounts();
      await instSalesICO.methods.buyTokens().send({
        from: accounts[0], value: amountToSend
      });
    } catch (err) {
      console.warn('error');
      this.setState({errBuyTokens: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };


  transfer = async event => {
    event.preventDefault();
    const errorText = 'errTransfer';
    this.setState({loading: true, errTransfer: ''});
    if(!this.checkAddress(this.state.to, errorText)) {
      return;
    };
    if(!this.checkNumeric(this.state.amountTranfer,  errorText)){
      return;
    };

    const amountToSend = web3.utils.toWei(this.state.amountTranfer, "ether");
    console.log(this.state.to, amountToSend);
    try {
      const accounts = await web3.eth.getAccounts();
      await instData1.methods.transfer(this.state.to, amountToSend).send({
        from: accounts[0], value: 0
      });
      const balanceFrom = await instData1.methods.balanceOfVToken(accounts[0]).call();
      const balanceTo = await instData1.methods.balanceOfVToken(this.state.to).call();
      const balanceFromD18 = web3.utils.fromWei(balanceFrom, "ether");
      const balanceToD18 = web3.utils.fromWei(balanceTo, "ether");
      console.log('balanceFrom', balanceFrom, 'balanceFromD18', balanceFromD18, 'balanceTo', balanceTo, 'balanceToD18', balanceToD18);
      this.setState({balanceTo: balanceTo, balanceFrom: balanceFrom, balanceToD18: balanceToD18, balanceFromD18: balanceFromD18});
    } catch (err) {
      console.warn('error');
      this.setState({errTransfer: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };

  safeTransferFrom3 = async event => {
    event.preventDefault();
    const errorText = 'errTransferFrom3';
    this.setState({loading: true, errTransferFrom3: ''});

    const from    = this.state.from;
    const to      = this.state.to;
    const tokenId = this.state.tokenId;
    if(!this.checkAddress(from, errorText)) {
      return;
    };
    if(!this.checkAddress(to, errorText)) {
      return;
    };
    if(!this.checkNumeric(tokenId, errorText)){
      return;
    };

    const accounts = await web3.eth.getAccounts();
    const acc0 = accounts[0];
    const tokenOwner = await instData1.methods.ownerOf(tokenId).call();
    const approved = await instData1.methods.getApproved(tokenId).call();
    const yesApprovedForAll = await instData1.methods.isApprovedForAll(tokenOwner, acc0).call();

    //canTransfer(uint256 _tokenId): tokenOwner == msg.sender || getApproved(_tokenId) == msg.sender || is_ownerToOperator[tokenOwner][msg.sender], "msg.sender should be tokenOwner, approved, or a token operator")
    const c1 = Boolean(tokenOwner.toLowerCase() === accounts[0].toLowerCase());
    const c2 = Boolean(approved === acc0);
    const c3 = Boolean(yesApprovedForAll);
    if(c1 || c2 || c3) {
      console.log("msg.sender is good, either tokenOwner, approved, or a token operator");
    } else {
      console.log("msg.sender is good, either tokenOwner, approved, or a token operator");
      console.log('c1', c1, 'c2', c2, 'c3', c3);
      return;
    };
    console.log('accounts[0]', acc0, 'tokenOwner', tokenOwner, 'approved', approved, 'yesApprovedForAll', yesApprovedForAll, 'from', from, 'to', to, 'tokenId', tokenId);
    try {
      //safeTransferFrom(address _from, address _to, uint256 tokenId)
      await instData1.methods.safeTransferFrom(from, to, tokenId).send({
        from: acc0, value: 0
      });
      const outTokenID_tokenOwner = await instData1.methods.ownerOf(tokenId).call();
      const outTokenID_tokenURI = await instData1.methods.tokenURI(tokenId).call();
      const outTokenCountFrom = await instData1.methods.balanceOf(from).call();
      const outTokenCountTo = await instData1.methods.balanceOf(to).call();

      console.log('outTokenID_tokenOwner', outTokenID_tokenOwner, 'outTokenID_tokenURI', outTokenID_tokenURI, 'outTokenCountFrom', outTokenCountFrom, 'outTokenCountTo', outTokenCountTo);
      
      this.setState({outTokenID_tokenOwner: outTokenID_tokenOwner, outTokenID_tokenURI: outTokenID_tokenURI, outTokenCountFrom: outTokenCountFrom, outTokenCountTo: outTokenCountTo, tokenId_Show: true, account_show: true});

    } catch (err) {
      console.warn('error');
      this.setState({errTransferFrom3: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };


  isOperator = async event => {
    event.preventDefault();
    const errorText = 'errIsOperator';
    this.setState({errIsOperator: ''});
    if(!this.checkAddress(this.state.from, errorText)) {
      return;
    };
    if(!this.checkAddress(this.state.spender, errorText)) {
      return;
    };

    console.log(this.state.from,this.state.spender);
    try {
      const isOperator = await instData1.methods.isApprovedForAll(this.state.from,this.state.spender).call();
      console.log('isOperator', isOperator);
      this.setState({isOperator: isOperator});
    } catch (err) {
      console.warn('error');
      this.setState({errIsOperator: err.message});
    }
    console.log('no error');
    this.setState({value: ''});//reset the state values
  };


  approve = async event => {
    event.preventDefault();
    const errorText = 'errApprove';
    this.setState({loading: true, errApprove: ''});
    console.log('inside approve()');
    const spender = this.state.spender;
    const tokenId = this.state.tokenId;
    if(!this.checkAddress(spender, errorText)) {
      return;
    };
    if(!this.checkNumeric(tokenId, errorText)){
      return;
    };

    try {
      const accounts = await web3.eth.getAccounts();
      const acc0 = accounts[0];
      const tokenOwner = await instData1.methods.ownerOf(tokenId).call();
      const yesApprovedForAll = await instData1.methods.isApprovedForAll(tokenOwner, acc0).call();
      //is_ownerToOperator[_owner][_operator];
  
      if(tokenOwner.toLowerCase() === accounts[0].toLowerCase() ||
        yesApprovedForAll) {
        //tokenOwner == msg.sender || is_ownerToOperator[tokenOwner][msg.sender]
          console.log('msg.sender is good: the owner or approved operator');
      } else {
          console.log('error: the msg.sender', accounts[0], 
              'is neither the owner', tokenOwner, 'nor not an approved operator');
          return;
      };

      if(spender.toLowerCase() !== tokenOwner.toLowerCase()) {
      //require(_approved != tokenOwner, "_approved should not be tokenOwner");
        console.log('spender is good');
      } else {
        console.log('error: "spender should not be tokenOwner"');
        return;
      };
  
      console.log(spender, tokenId);
      //approve(address _approved, uint256 _tokenId)
      await instData1.methods.approve(spender, tokenId).send({
        from: accounts[0], value: 0
      });
      console.log('before checking getApproved()');
      const approved = await instData1.methods.getApproved(tokenId).call();

      console.log('approved', approved);
      this.setState({approved: approved});

    } catch (err) {
      console.warn('error');
      this.setState({errApprove: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };


  setApprovalForAll = async event => {
    event.preventDefault();
    const errorText = 'errSetApprovalForAll';
    this.setState({loading: true, errSetApprovalForAll: ''});
    console.log('inside setApprovalForAll()');
    const spender = this.state.spender;
    const boolValue = this.state.boolValue;
    if(!this.checkAddress(spender, errorText)) {
      return;
    };
    if(!this.checkBooleanValue(boolValue, errorText)){
      return;
    };

    try {
      const accounts = await web3.eth.getAccounts();
      console.log(spender, boolValue);
      //setApprovalForAll(address _operator, bool _approved)
      await instData1.methods.setApprovalForAll(spender, boolValue).send({
        from: accounts[0], value: 0
      });
      const yesApprovedForAll = await instData1.methods.isApprovedForAll(accounts[0], spender).call();
      console.log('yesApprovedForAll', yesApprovedForAll);
      this.setState({yesApprovedForAll: yesApprovedForAll});

    } catch (err) {
      console.warn('error');
      this.setState({errApprove: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };


  mint = async event => {
    event.preventDefault();
    const errorText = 'errMintNFT';
    this.setState({loading: true, errMintNFT: ''});
    const tokenTo  = this.state.accountToCheck;
    const tokenId = this.state.tokenId;
    const tokenURI = this.state.mint_tokenURI;
    if(!this.checkAddress(tokenTo, errorText)) {
      return;
    };
    if(!this.checkNumeric(tokenId, errorText)){
      return;
    };
    if(!this.checkAddress(tokenURI, errorText)) {
      return;
    };
    // const tokenNameClean = trim(this.state.tokenNameN);
    // if(tokenNameClean > 55) {//42+13
    //   console.log('tokenNameClean cannot be > 42');
    //   return;
    // };
    //console.log(tokenNameClean, tokenSymbolClean, amountToSend);
    try {
      const accounts = await web3.eth.getAccounts();
      //mint(address _to, uint256 _tokenId, string _uri)  mint_to, tokenId, mint_tokenURI
      await instData1.methods.mint(tokenTo, tokenId, tokenURI).send({
        from: accounts[0], value: 0
      });
      console.log('after mint()');
      const outTokenID_tokenOwner = await instData1.methods.ownerOf(tokenId).call();
      const outTokenID_tokenURI = await instData1.methods.tokenURI(tokenId).call();
      const outTokenCountTo = await instData1.methods.balanceOf(tokenTo).call();

      console.log('outTokenID_tokenOwner', outTokenID_tokenOwner, 'outTokenCountTo', outTokenCountTo, 'outTokenID_tokenURI', outTokenID_tokenURI);
      this.setState({outTokenID_tokenOwner: outTokenID_tokenOwner, outTokenCountTo: outTokenCountTo, outTokenID_tokenURI: outTokenID_tokenURI, tokenId_Show: true, account_show: true});

    } catch (err) {
      console.warn('error',err.message);
      this.setState({errMintNFT: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };


  burn = async event => {
    event.preventDefault();
    const errorText = 'errBurnNFT';
    this.setState({loading: true, errBurnNFT: ''});
    const tokenTo  = this.state.accountToCheck;
    const tokenId = this.state.tokenId;
    if(!this.checkAddress(tokenTo, errorText)) {
      return;
    };
    if(!this.checkNumeric(tokenId, errorText)){
      return;
    };
    try {
      const accounts = await web3.eth.getAccounts();
      //burn(address _owner, uint256 _tokenId)
      await instData1.methods.burn(tokenTo, tokenId).send({
        from: accounts[0], value: 0
      });
      console.log('after burn()');
      const outTokenID_tokenOwner = await instData1.methods.ownerOf(tokenId).call();
      const outTokenID_tokenURI = await instData1.methods.tokenURI(tokenId).call();
      const outTokenCountTo = await instData1.methods.balanceOf(tokenTo).call();

      console.log('outTokenID_tokenOwner', outTokenID_tokenOwner, 'outTokenCountTo', outTokenCountTo, 'outTokenID_tokenURI', outTokenID_tokenURI);
      this.setState({outTokenID_tokenOwner: outTokenID_tokenOwner, outTokenCountTo: outTokenCountTo, outTokenID_tokenURI: outTokenID_tokenURI, tokenId_Show: true, account_show: true});

    } catch (err) {
      console.warn('error',err.message);
      this.setState({errBurnNFT: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };


  getNthTokenID = async event => {
    console.log('inside getNthTokenId()');
    event.preventDefault();
    const errorText = 'errGetNthTokenID';
    this.setState({loading: true, errGetNthTokenID: ''});
    const addrIn1  = this.state.accountToCheck;
    const indx1 = this.state.indx1;
    if(!this.checkAddress(addrIn1, errorText)) {
      return;
    };
    if(!this.checkNumeric(indx1, errorText)){
      return;
    };
    try {
      const NthTokenID = await instData1.methods.tokenOfOwnerByIndex(addrIn1, indx1).call();
      console.log('NthTokenID', NthTokenID);
      this.setState({NthTokenID: NthTokenID});

    } catch (err) {
      console.warn('error',err.message);
      this.setState({errGetNthTokenID: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };

  

  //saveAddresses
  saveAddresses = async event => {
    event.preventDefault();
    this.setState({addr1: this.state.addr1tmp, addr2: this.state.addr2tmp, addr3: this.state.addr3tmp});
  };
  setTo1 = async event => {
    this.setState({to: this.state.addr1, accountToCheck: this.state.addr1});
  };
  setTo2 = async event => {
    this.setState({to: this.state.addr2, accountToCheck: this.state.addr2});
  };
  setTo3 = async event => {
    this.setState({to: this.state.addr3, accountToCheck: this.state.addr3});
  };
  setFrom1 = async event => {
    this.setState({from: this.state.addr1});
  };
  setFrom2 = async event => {
    this.setState({from: this.state.addr2});
  };
  setFrom3 = async event => {
    this.setState({from: this.state.addr3});
  };
  setSpender1 = async event => {
    this.setState({spender: this.state.addr1});
  };
  setSpender2 = async event => {
    this.setState({spender: this.state.addr2});
  };
  setSpender3 = async event => {
    this.setState({spender: this.state.addr3});
  };

  jsUcfirst = (string) => {
    if(string===undefined){return '';
    } else {return string.charAt(0).toUpperCase() + string.slice(1);}
  }

  /*onSubmit = async event => {
    event.preventDefault();
    const instCtrt1 = Ctrt1(this.props.address);
    this.setState({loading: true, errorMessage: ''});
    try {
      const accounts = await web3.eth.getAccounts();
      await instCtrt1.methods.contribute().send({
        from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      console.warn('error');
      this.setState({errorMessage: err.message});
    }
    console.log('no error');
    this.setState({loading: false, value: ''});//reset the state values
  };*/

  //have to make some JSX so Readt doesn't show error
  listBasicCtrtDetails() {//{this.listBasicCtrtDetails()}
    // const items = [{header: 0x0,
    //   description: (<span>owner</span>),
    //     fluid: true
    //   }];
    //console.warn(this.props.owners);

    const items = this.props.owners.map((address, index) => {
      return {
        header: address,
      description: (<span>owners[{index}]</span>),
        fluid: true
      };
    });
    /*fluid: true ... will stretch all the way to the right & left
      then the link goes to where the router decides
      value={} to see the current value of the state at the start
    */
    /*
    const items = this.props.lists.map(address => {
      return {
        header: address,
      description: (<Link route={`/lists/${address}`}><a>View Campaign</a></Link>),
        fluid: true
      };
    });*/
    return <Card.Group items={items} />;
  }
  /**
        <br></br>owner: {this.state.VTokenDetail['0']}
        <br></br>ownerProposed: {this.state.VTokenDetail['1']}
        <br></br>manager: {this.state.VTokenDetail['2']}
        <br></br>admin: {this.state.VTokenDetail['3']}
        <br></br>name: {this.state.VTokenDetail['4']}
        <br></br>symbol: {this.state.VTokenDetail['5']}
        <br></br>decimals: {this.state.VTokenDetail['6']}
        <br></br>totalSupply: {this.state.VTokenDetail['7']}
        <br></br>tokenDump: {this.state.VTokenDetail['8']}
        <br></br>newTokenCtrt: {this.state.VTokenDetail['9']}
        <br></br>newTokenTreasury: {this.state.VTokenDetail['10']}
   */
  render() {
    //return <div>lists Index! {this.props.lists[0]}</div>;
    /*  , background: '#262626', color: '#ffffff'
    */
   //console.log('outTokenID_tokenOwner', outTokenID_tokenOwner, 'outTokenCountTo', outTokenCountTo, 'outTokenID_tokenURI', outTokenID_tokenURI);
    let tokenIdSection;
    if (this.state.tokenId_Show === false) {
      console.log('tokenIdSection: no show');
      tokenIdSection =<div>Token Details:</div>
    } else {
      console.log('tokenIdSection: showing');
      tokenIdSection =
      <div style={{fontSize:'18px'}}>
        Token Details:
        <br></br>token owner: {this.state.outTokenID_tokenOwner}
        <br></br>token tokenURI: {this.state.outTokenID_tokenURI}
        <br></br>approved spender: {this.state.approved}
      </div>
    }

    let accountDetailSection;
    if (this.state.account_show === false) {
      console.log('accountDetailSection: no show');
      accountDetailSection =<div>Account Details:</div>
    } else {
      console.log('accountDetailSection: showing');
      accountDetailSection =
      <div style={{fontSize:'18px'}}>
        Account Details:
        <br></br>To Account Token Count: {this.state.outTokenCountTo}
        <br></br>From Account Token Count: {this.state.outTokenCountFrom}
      </div>
    }
    // outTokenCountTo: {this.state.outTokenCountToD18},
    // BalanceTo: {this.state.balanceToD18}, BalanceFrom: {this.state.balanceFromD18}
    //      console.log('outTokenID_tokenOwner', outTokenID_tokenOwner, 'outTokenID_tokenURI', outTokenID_tokenURI, 'outTokenCountFrom', outTokenCountFrom, 'outTokenCountTo', outTokenCountTo);


    const style1 = {backgroundImage: 'radial-gradient(circle farthest-corner at -7% -8%, #3fe1d5, #00abd0)'};
    /*if not showing state values: either name is wrong, or it's {boolean+''} !!! */
    return (
       <Layout>
        <div style={{}}>
          <h1>ERC721 SPLC NFT Token</h1>
          <a style={{display: "table-cell"}} href="https://rinkeby.etherscan.io/address/0xe6da20c6f3ba3ac86c7fa3da155e5847f3cde7e6" target="_blank">contract url on Etherscan</a>
          <Button style={style1} floated="right" content="Check account" primary onClick={this.getAccount}/>
          <br></br>
          <div className="" style={{fontSize:'18px'}}>
            Account: {this.state.account}
            <br></br>
            BalanceETH: {this.state.balanceETHd18} ETH,&nbsp;&nbsp;
            Network: {this.jsUcfirst(this.state.network)}{this.state.networkText},&nbsp;&nbsp;
            BalanceNFT: {this.state.balanceNFT} SPLC Tokens
            <br></br>
            <br></br>Token Details - General
            <br></br>
            <br></br>NFT Token Details
            <br></br>owner: {this.state.owner}
            <br></br>name: {this.state.name}
            <br></br>symbol: {this.state.symbol}
            <br></br>totalSupply: {this.state.totalSupply}
          </div>
        </div>

        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          {tokenIdSection}
          <Grid columns={2} stackable>
          <Grid.Column>
            <Form onSubmit={this.getTokenDetail} error={!!this.state.errGetTokenDetail}>
              <Form.Field>
                <Input value={this.state.tokenId} style={{}}
                  onChange={event => {this.setState({tokenId: event.target.value});this.checkAddress(event.target.value,'errGetTokenDetail');}}
                  label="Token ID" labelPosition="right" size='small' placeholder='Token ID'/>
              </Form.Field>
              <Message error header="Oops!" content={this.state.errGetTokenDetail.substring(0, 300)} />
              <Button style={style1} primary loading={this.state.loading}>Check SPLC NFT Token details</Button>
            </Form>
          </Grid.Column>
          <Grid.Column>
            <div  style={{marginTop: '50px'}}>
              <Button floated="right" content="Hide SPLC NFT Token detail" primary onClick={this.hideTokenDetail} style={style1} />
            </div>
          </Grid.Column>
          </Grid>

        </div>

        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          {accountDetailSection}
          <span style={{float: 'right', fontSize:'14px'}}>SPLC NFT Token</span>
          <br></br>
          <Form onSubmit={this.checkAccount} error={!!this.state.errAccountDetail}>
            <Form.Field>
              <Input value={this.state.accountToCheck}
                onChange={event => {this.setState({accountToCheck: event.target.value});this.checkAddress(event.target.value,'errAccountDetail');}}
                label="account address" labelPosition="right" size='small' placeholder='enter account address'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errAccountDetail.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Check Balance</Button>
          </Form>
        </div>


        <hr style={{}}></hr>
        <div style={{}}>
          <div className="basic-details" style={{fontSize:'18px'}}>
          addr1: {this.state.addr1}
          <br></br>
          addr2: {this.state.addr2}
          <br></br>
          addr3: {this.state.addr3}
          </div>

          <Header as='h3' content='' textAlign='center' style={{marginTop: '10px',}} />
          <Grid columns={3} stackable>
            <Grid.Column>
              <Header as='h5'>Set to address</Header>
              <Button floated="left" content="addr1" className="tiny" primary onClick={this.setTo1}/>
              <Button floated="left" content="addr2" className="tiny" primary onClick={this.setTo2}/>
              <Button floated="left" content="addr3" className="tiny" primary onClick={this.setTo3}/>
            </Grid.Column>
            <Grid.Column>
              <Header as='h5'>Set from address</Header>
              <Button floated="left" content="addr1" className="tiny" primary onClick={this.setFrom1}/>
              <Button floated="left" content="addr2" className="tiny" primary onClick={this.setFrom2}/>
              <Button floated="left" content="addr3" className="tiny" primary onClick={this.setFrom3}/>
            </Grid.Column>
            <Grid.Column>
              <Header as='h5'>Set spender address</Header>
              <Button floated="left" content="addr1" className="tiny" primary onClick={this.setSpender1}/>
              <Button floated="left" content="addr2" className="tiny" primary onClick={this.setSpender2}/>
              <Button floated="left" content="addr3" className="tiny" primary onClick={this.setSpender3}/>
            </Grid.Column>
          </Grid>
        </div>
        <br></br>

        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          Make New SPLC NFT Token: mint() function
          <br></br>
          <Form onSubmit={this.mint} error={!!this.state.errMintNFT}>
            <Form.Field>
              <Input value={this.state.accountToCheck}
                onChange={event => {this.setState({accountToCheck: event.target.value});this.checkAddress(event.target.value,'errMintNFT');}}
                label="to address" labelPosition="right" size='small' placeholder='to address'/>

              <Input value={this.state.tokenId}
                onChange={event => {this.setState({tokenId: event.target.value});this.checkNumeric(event.target.value,'errMintNFT');}}
                label="token Id" labelPosition="right" size='small' placeholder='token Id'/>

              <Input value={this.state.mint_tokenURI}
                onChange={event => {this.setState({mint_tokenURI: event.target.value});this.checkAddress(event.target.value,'errMintNFT');}}
                label="token URI" labelPosition="right" size='small' placeholder='token URI'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errMintNFT.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Mint NFT</Button>
          </Form>
        </div>


        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          Destroy SPLC NFT Token: burn() function
          <br></br>
          <Form onSubmit={this.burn} error={!!this.state.errBurnNFT}>
            <Form.Field>
              <Input value={this.state.accountToCheck}
                onChange={event => {this.setState({accountToCheck: event.target.value});this.checkAddress(event.target.value,'errBurnNFT');}}
                label="to address" labelPosition="right" size='small' placeholder='to address'/>

              <Input value={this.state.tokenId}
                onChange={event => {this.setState({tokenId: event.target.value});this.checkNumeric(event.target.value,'errBurnNFT');}}
                label="token Id" labelPosition="right" size='small' placeholder='token Id'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errBurnNFT.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Burn NFT</Button>
          </Form>
        </div>


        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          Get the n-th NFT ID from a list of owner's tokens:
          {this.state.NthTokenID}
          <br></br>
          <Form onSubmit={this.getNthTokenID} error={!!this.state.errGetNthTokenID}>
            <Form.Field>
              <Input value={this.state.accountToCheck}
                onChange={event => {this.setState({accountToCheck: event.target.value});this.checkAddress(event.target.value,'errGetNthTokenID');}}
                label="to address" labelPosition="right" size='small' placeholder='to address'/>

              <Input value={this.state.indx1}
                onChange={event => {this.setState({indx1: event.target.value});this.checkNumeric(event.target.value,'errGetNthTokenID');}}
                label="token Id" labelPosition="right" size='small' placeholder='token Id'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errGetNthTokenID.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Get n-th NFT ID</Button>
          </Form>
        </div>


        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          Buy Tokens
          <br></br>
          <Form onSubmit={this.buyTokens} error={!!this.state.errBuyTokens}>
            <Form.Field>
              <Input value={this.state.amountBuyTokens}
                onChange={event => {this.setState({amountBuyTokens: event.target.value});this.checkNumeric(event.target.value,'errBuyTokens');}}
                label="ETH" labelPosition="right" size='small' placeholder='amount'/>
            </Form.Field>
            <Message error header="Oops!" content={this.state.errBuyTokens.substring(0, 300)} />
            <Button className="red" loading={this.state.loading}>Buy Tokens</Button>
          </Form>
        </div>


        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          TransferFrom Tokens
          <br></br>
          <Form onSubmit={this.safeTransferFrom3} error={!!this.state.errTransferFrom3}>
            <Form.Field>
            <Input value={this.state.from}
                onChange={event => {this.setState({from: event.target.value});this.checkAddress(event.target.value,'errTransferFrom3');}}
                label="from address" labelPosition="right" size='small' placeholder='from address'/>

              <Input value={this.state.to}
                onChange={event => {this.setState({to: event.target.value});this.checkAddress(event.target.value,'errTransferFrom3');}}
                label="to address" labelPosition="right" size='small' placeholder='to address'/>

              <Input value={this.state.tokenId}
                onChange={event => {this.setState({tokenId: event.target.value});this.checkNumeric(event.target.value,'errBurnNFT');}}
                label="token Id" labelPosition="right" size='small' placeholder='token Id'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errTransferFrom3.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>TransferFrom(from, to, amount)</Button>
          </Form>
        </div>


        <hr style={{}}></hr>
        <div style={{}}>
          <div className="basic-details" style={{fontSize:'18px'}}>
          addr1: {this.state.addr1}
          <br></br>
          addr2: {this.state.addr2}
          <br></br>
          addr3: {this.state.addr3}
          </div>

          <Header as='h3' content='' textAlign='center' style={{marginTop: '10px',}} />
          <Grid columns={3} stackable>
            <Grid.Column>
              <Header as='h5'>Set to address</Header>
              <Button floated="left" content="addr1" className="tiny" primary onClick={this.setTo1}/>
              <Button floated="left" content="addr2" className="tiny" primary onClick={this.setTo2}/>
              <Button floated="left" content="addr3" className="tiny" primary onClick={this.setTo3}/>
            </Grid.Column>
            <Grid.Column>
              <Header as='h5'>Set from address</Header>
              <Button floated="left" content="addr1" className="tiny" primary onClick={this.setFrom1}/>
              <Button floated="left" content="addr2" className="tiny" primary onClick={this.setFrom2}/>
              <Button floated="left" content="addr3" className="tiny" primary onClick={this.setFrom3}/>
            </Grid.Column>
            <Grid.Column>
              <Header as='h5'>Set spender address</Header>
              <Button floated="left" content="addr1" className="tiny" primary onClick={this.setSpender1}/>
              <Button floated="left" content="addr2" className="tiny" primary onClick={this.setSpender2}/>
              <Button floated="left" content="addr3" className="tiny" primary onClick={this.setSpender3}/>
            </Grid.Column>
          </Grid>
        </div>
        <br></br>

        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          Approve:
          <br></br>
          <Form onSubmit={this.approve} error={!!this.state.errApprove}>
            <Form.Field>
              <Input value={this.state.spender}
                onChange={event => {this.setState({spender: event.target.value});this.checkAddress(event.target.value,'errApprove');}}
                label="spender address" labelPosition="right" size='small' placeholder='spender address'/>

              <Input value={this.state.tokenId}
                onChange={event => {this.setState({tokenId: event.target.value});this.checkNumeric(event.target.value,'errApprove');}}
                label="SPLC NFT Token" labelPosition="right" size='small' placeholder='amount'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errApprove.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Approve</Button>
          </Form>
        </div>


        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          Set Operator:
          <br></br>
          <Form onSubmit={this.setApprovalForAll} error={!!this.state.errApprove}>
            <Form.Field>
              <Input value={this.state.spender}
                onChange={event => {this.setState({spender: event.target.value});this.checkAddress(event.target.value,'errSetOperator');}}
                label="spender address" labelPosition="right" size='small' placeholder='spender address'/>

              <Input value={this.state.boolValue}
                onChange={event => {this.setState({boolValue: event.target.value});}}
                label="boolValue" labelPosition="right" size='small' placeholder='boolValue'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errApprove.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Set Operator</Button>
          </Form>
        </div>



        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          isOperator: {this.state.isOperator+''}
          <br></br>
          <Form onSubmit={this.isOperator} error={!!this.state.errIsOperator}>
            <Form.Field>
              <Input value={this.state.from}
                onChange={event => {this.setState({from: event.target.value});this.checkAddress(event.target.value,'errIsOperator');}}
                label="from address" labelPosition="right" size='small' placeholder='from address'/>

              <Input value={this.state.spender}
                onChange={event => {this.setState({spender: event.target.value});this.checkAddress(event.target.value,'errIsOperator');}}
                label="spender address" labelPosition="right" size='small' placeholder='spender address'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errIsOperator.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Check isOperator</Button>
          </Form>
        </div>

        <hr style={{}}></hr>
        <div style={{fontSize:'18px'}}>
          Enter your own account addresses
          <br></br>
          <Form onSubmit={this.saveAddresses} error={!!this.state.errSetAccounts}>
            <Form.Field>
              <Input value={this.state.addr1tmp}
                onChange={event => {this.setState({addr1tmp: event.target.value});this.checkAddress(event.target.value,'errSetAccounts');}}
                label="address1" labelPosition="right" size='small' placeholder='address1'/>

              <Input value={this.state.addr2tmp}
                onChange={event => {this.setState({addr2tmp: event.target.value});this.checkAddress(event.target.value,'errSetAccounts');}}
                label="address2" labelPosition="right" size='small' placeholder='address2'/>

              <Input value={this.state.addr3tmp}
                onChange={event => {this.setState({addr3tmp: event.target.value});this.checkAddress(event.target.value,'errSetAccounts');}}
                label="address3" labelPosition="right" size='small' placeholder='address3'/>

            </Form.Field>
            <Message error header="Oops!" content={this.state.errSetAccounts.substring(0, 300)} />
            <Button style={style1} primary loading={this.state.loading}>Save Addresses</Button>
          </Form>
        </div>

      </Layout>
    );//<a>
  }
}
/*
          <Link route="/lists/new">
          <a>
          <Button floated="right" content="Add a new proposal"  icon="add circle" primary />
          </a>
          </Link>
primary ... same as primary={true}
icon="add circle" ... you can find the iconName in the documantation
Button: Do Not add () inside onClick={} bcos it needs to reference to the function, but not to call the function here
Difficult for Next js to accommadate re-used components
Workaround: Make a new folder called components(so the Layout.js won't make a new url page)
make one Layout.js to house common components
then import this Layout.js into every page, then display
*/
export default MainIndex;
/*
if use CDN links, update them... like semantic-ui css

update token > compile to get abi in json format
Go to package.json > add scripts: ,"dev": "next dev"
$ npm run dev
Go to http://localhost:3000/

> make a contract.js ... then come back here 
> Use only class based component

confirm it return array with above contract address
Error: The connection to http://localhost:3000/_next/webpack-hmr was interrupted while the page was loading.  main.js:9874:13


..Next tries to render MainIndex component > getInitialProps function executed
  > initial data returned > gives it to MainIndex component as props
  > component redered on the server > produced HTML
  To test only server side rendering(mobile devices, no MetaMask browsers...): in Chromium > click on the little ! circle before url > site settings > block javascript > reload
  > re-enable javascript

-> Next  is Reaching out to Ethereum Network
So it does not matter if the end user is using MetaMask or not!

-> HTML document produced > Send it to the browser
so it's faster to show it on the browser, especially for mobile end user
-> Then send out js code to browser
-> The js code boots up, then takes over the DOM

----==Token in url
server.js: boots up the Next app -> tell it to use routes.js
routes.js: defines our defferent routes -> CampaignNew, CampaignShow

To kill port already in use problem
$ lsof -i :3000
$ kill -9 <PID>

Dynamic routing is not built in for Next => Use Next-routes
$ npm install --save next-routes


Production Deployment
https://github.com/zeit/now-cli
$ npm install -g now
  In the package.json file, add the following two scripts:
  "build": "next build",
  "start": "next start",
  "start2": "NODE_ENV=production node server.js"

$ npm run build
$ npm run start


MetaMask: Don't use Google play to install MetaMask, there is a fraudulent copycat app in there. Make sure to use the Chrome Web store for the real thing

MetaMask Deprecated
Hi Guys - The way we wrote all of our projects actually took this into consideration!
That message is essentially saying that metamask will not inject web3, and will instead only inject web3.currentProvider.  In other words, metamask wants you to bring your own copy of web3 and only use its (metamasks) provider to set up your web3 instance - that's exactly what we're doing. So at some point in time in the future, when metamasks' web3 is deprecated, we will update our web3.js files to make use of that new provider, rather than window.web3.currentProvider.  It will be a one-line code fix.


failed to load resource the server responded with a status of 500 (internal server error) favicon react
https://stackoverflow.com/questions/31075893/im-getting-favicon-ico-error
=> Put a favicon.ico file inside pages folder, the the line below inside header in Layout.js
<link rel="shortcut icon" href="#/favicon.ico" />

when you run $ npm run dev, it says
> Using external babel configuration
> Location: "/.../folderXYZ/.babelrc"
... from the folder you last time ran babel or react!
=> Delete that file!

next js Module build failed: Error: Couldn't find preset "es2015" relative to directory
/node_modules/babel-core/lib/transformation/file/options/option-manager.js
/node_modules/babel-core/lib/transformation/file/index.js
Fix: Removed (hidden) .babelrc (global?) file from "/Users/nikolai".


-------------==Why not using Truffle
1) You can't pick your own web3 version.  Right now truffle is still using web3 v0.20, not the v1.0.0 that's shown in this course.  I really suspect that most people in this course would prefer to use the latest version of web3.

2) Testing setup is really wonky.  Truffle's testing suite automatically deploys a instance of your contract to run tests on, but it only deploys it once for each describe block.  That means that each 'it' block in a single describe is using the exact same contract instance.  This is a 'Testing 101 no-no'.  We want a clean state for each test we run, we don't want to reuse any artifacts between tests.

3) The migration and build scripts sometimes don't work, requiring you to manually delete compiled contracts files and recompile them.  This can lead to endless headaches.

*/