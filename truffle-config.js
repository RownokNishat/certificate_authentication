require('babel-register');
require('babel-polyfill');
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonicAyon = "chuckle pipe amazing miracle blue rude balance view garlic crack enact erosion";

module.exports = {
  networks: {
    development: {
      //host: "127.0.0.1",
      //port: 7545,
      //network_id: "*" // Match any network id
      host: "127.0.0.1",
      port: 8545,
      network_id: "14333" // Match any network id
    },
  //   rinkeby: {
  //     provider: function() { 
  //      return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/6c699e88485843489010d11cf9d93496");
  //     },
  //     network_id: 4,
  //     gas: 4500000,
  //     gasPrice: 10000000000,
  // }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.13",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
