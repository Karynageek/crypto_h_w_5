import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
    },
  },
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    bscTestnet: {
      url: process.env.BSC_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY
    //apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
