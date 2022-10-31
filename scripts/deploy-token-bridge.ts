import hre, { ethers } from "hardhat";
import { TokenBridge } from "../typechain-types/contracts/TokenBridge";
import { TokenBridge__factory } from "../typechain-types/factories/contracts/TokenBridge__factory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

  const backendAddress = "0xF2A74B4d7E908fc8a86c2dFee3712ebc8E0A7293";

  let tokenBridge: TokenBridge;
  let owner: SignerWithAddress;
  let addrs: SignerWithAddress[];

  [owner, ...addrs] = await ethers.getSigners();

  const TokenBridge = (await ethers.getContractFactory('TokenBridge')) as TokenBridge__factory;
  tokenBridge = await TokenBridge.deploy(backendAddress);
  await tokenBridge.deployed();

  console.log("TokenBridge deployed to:", tokenBridge.address);

  await delay(35000);

  await hre.run("verify:verify", {
    address: tokenBridge.address,
    constructorArguments: [backendAddress],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
