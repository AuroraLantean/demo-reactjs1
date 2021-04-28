# Demo-ReactJs1

deployment at
https://auroralantean.github.io/demo-reactjs1/

## To Deploy
For Production:  isProduction to 1
Else: Set isProduction = 0

$ yarn deploy
then push

contractGroupId inside the config file is needed to specify which smart contract to use: 0 for dev or 1 for production smart contract

all the functions you specified are inside store.js, and other related functions are inside ethFunc.js, and App.js

The common way you mentioned can be found inside ethFunc.js, where getWeb3() will detect if MetaMask exists, then get web3 to make contract instances and get accounts, network, then I put all these four elements inside "compo" for easy access

so different functions can find what they need inside compo

## Debug
