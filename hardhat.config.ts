import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

let accounts;
accounts = {
  mnemonic: process.env.MNEMONIC,
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      hardfork: "london",
      accounts,
      allowUnlimitedContractSize: false,
      mining: {
        auto: true,
        interval: 2000,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts,
      mining: {
        auto: false,
        interval: [3000, 6000],
      },
    },
  },
};

export default config;
