import hre, { ethers } from "hardhat";
import { OrangeToken } from "../typechain-types/contracts/OrangeToken";
import { OrangeToken__factory } from "../typechain-types/factories/contracts/OrangeToken__factory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

  let orangeToken: OrangeToken;
  let owner: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const name = "Orange Token";
  const symbol = "OT";

  [owner, ...addrs] = await ethers.getSigners();

  const OrangeToken = (await ethers.getContractFactory('OrangeToken')) as OrangeToken__factory;
  orangeToken = await OrangeToken.deploy(name, symbol);
  await orangeToken.deployed();

  console.log("OrangeToken deployed to:", orangeToken.address);

  await delay(35000);

  await hre.run("verify:verify", {
    address: orangeToken.address,
    constructorArguments: [name, symbol],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
