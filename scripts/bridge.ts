import { ethers } from "hardhat";
import { TokenBridge } from "../typechain-types/contracts/TokenBridge";
import { Contract, Wallet, getDefaultProvider } from "ethers";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  console.log("Script has started");

  const rinkebyProvider = getDefaultProvider(process.env.RINKEBY_URL as string);
  const bscProvider = getDefaultProvider(process.env.BSC_URL as string);

  const mnemonic = process.env.MNEMONIC ?? "";
  const account = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(`m/44'/60'/0'/0/0`);
  const signerRinkeby = new Wallet(account, rinkebyProvider);
  const signerBsc = new Wallet(account, rinkebyProvider);

  const bridgeRinkebyAddress = "0x4bf71Cad8F7b48844BDf39267Eb8fDA7122F83dC";
  const bridgeBscAddress = "0xedfa215f81895ba5bb59bb15c0b23df6f887ae68";

  let BridgeRinkeby = await ethers.getContractAt("TokenBridge", bridgeRinkebyAddress);
  let bridgeRinkeby = (new Contract(BridgeRinkeby.address, BridgeRinkeby.interface, rinkebyProvider)) as TokenBridge;

  let BridgeBsc = await ethers.getContractAt("TokenBridge", bridgeBscAddress);
  let bridgeBsc = (new Contract(BridgeBsc.address, BridgeBsc.interface, bscProvider)) as TokenBridge;

  //replace _depositToken
  bridgeRinkeby.on("Deposit", async (_chainId, _depositToken, _amount, _receiver) => {
    console.log("Rinkeby", {
      chainId: _chainId,
      depositToken: _depositToken,
      amount: _amount.toString(),
      receiver: _receiver
    });

    const nonce = await bridgeRinkeby.nonce();

    const msgHash = ethers.utils.solidityKeccak256(["address", "address", "uint256", "uint256", "uint256"], [_depositToken, _receiver, _amount.toString(), _chainId, nonce]);
    console.log("Msg hash: ", msgHash);

    const signMsgHash = await signerRinkeby.signMessage(msgHash);
    const sig = ethers.utils.splitSignature(signMsgHash);
    console.log(sig);
    console.log("Sign msg hash: ", signMsgHash);
  });

  bridgeBsc.on("Deposit", async (_chainId, _depositToken, _amount, _receiver) => {
    console.log("BSC", {
      chainId: _chainId,
      depositToken: _depositToken,
      amount: _amount.toString(),
      receiver: _receiver
    });

    const nonce = await bridgeRinkeby.nonce();

    const msgHash = ethers.utils.solidityKeccak256(["address", "address", "uint256", "uint256", "uint256"], [_depositToken, _receiver, _amount.toString(), _chainId, nonce]);
    console.log("Msg hash: ", msgHash);

    const signMsgHash = signerBsc.signMessage(msgHash);
    console.log("Sign msg hash: ", signMsgHash);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
