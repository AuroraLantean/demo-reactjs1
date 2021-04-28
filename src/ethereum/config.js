/*config ...
@type: Configuration
@brief ... 

//-------------== To Deploy
For Production:  isProduction to 1

$ yarn deploy 
Then push
//-------------==
manual push: copy ethereum192x192.png into repo

erc20TokenAddress: '',

@date   2021-04-26
*/
export const config = {
  infuraProvider:
    "https://eth-mainnet.alchemyapi.io/v2/k2--UTxxx",
  ethNodeURL0: "",
  ethNodeURL1: "https://mainnet.infura.io/v3/75df2",
  ethNodeURL4: "https://rinkeby.infura.io/v3/75df2",
  ethNodeURL42: "https://kovan.infura.io/v3/75df2",
  gasDataSource:
    "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=GH7KVC23UWE9BTDKDVRDSTTE5X8I25U2X5",
  password: "abc123",
  DBID: 0,
  isProduction: 0,
  serverNumer: 1,
  gasPrice: 55,
  gasLimit: 200000,
  server0: "http://localhost:3000",
  server1: "https://google.com",
  defaultUserChoice: 2,
  user1: "0x22202c0dF1f47E06303fCDe7F25bB0ef0429d61E",
  user2: "0xF7Cff794396F15619628625C1778FFe880ee5326",
  recordsPerPage: 3,
  contractGroupId: 42,
  SalesCtrt_Kovan: "0x8Bbc9a890c8D82312e88D1de0989a7a493110adD",
  ERC20FixedSupply_Kovan: "0x1A9dCe212Cd804A7D95B28f6A9AE32861DC12221"
};

export const assetNames = [
  {
    key: "001",
    text: "Bitcoin",
    value: "bitcoin",
  },
  {
    key: "002",
    text: "Ethereum",
    value: "ethereum",
  },
];

export const addrTos = [
  {
    key: "0",
    text: "SalesCtrt",
    value: config.SalesCtrt_Kovan,
  },
  {
    key: "1",
    text: "User1",
    value: config.user1,
  },
  {
    key: "2",
    text: "User2",
    value: config.user2,
  },
];

export const slotIds = [
  {
    key: "001",
    text: "SlotId 001",
    value: "1",
  },
  {
    key: "002",
    text: "SlotId 002",
    value: "2",
  },
  {
    key: "003",
    text: "SlotId 003",
    value: "3",
  },
];
