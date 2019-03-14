var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'hundred theory modify crazy modify head type assault still offer mixed famous';
var accessToken = 'https://rinkeby.infura.io/v3/c687837206fa408891fed0bd08ee0de6';
const gas = 4000000;
const gasPrice = 1000000000 * 60;

module.exports = {
    networks: {
        rinkeby: {
            provider: function () {
              return new HDWalletProvider(
                mnemonic,
                accessToken
            );
            },
            network_id: 4,
            gas: gas,
            gasPrice: gasPrice,
            skipDryRun: true
        }
    },
    compilers: {
      solc: {
        version: "0.5.2",
      }
    }
};