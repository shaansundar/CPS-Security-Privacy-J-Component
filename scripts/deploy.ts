import { Contract, ContractFactory, Signer } from "ethers";
import { ethers } from "hardhat";
import data from "./mockData.json";

const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");
require("dotenv").config();


const user = nacl.box.keyPair();
const sensor = nacl.box.keyPair();

async function main() {
  let i: number = 1;

  let data = {id:1,doorStatus:"IN"};



  let user = await ethers.getSigners();
  let contractFactory: ContractFactory = await ethers.getContractFactory(
    "OnChainInterface"
  ); 
  let contract: Contract = await contractFactory.deploy();
  await contract.approveSensor(await user[0].getAddress());
  
  let onChainData = encrypt(JSON.stringify(data));
  
  await contract.write(JSON.stringify(onChainData));
 
  let onChainMessage= await contract.readAll()

  console.log(JSON.parse(await decrypt(onChainMessage[0])));
}


function encrypt(data:any) {
  const _nonce:Uint8Array = nacl.randomBytes(24);
    let _encryptedData = nacl.box(
      nacl.util.decodeUTF8(data),
      _nonce,
      user.publicKey,
      sensor.secretKey
    );
    let nonce: String[]=[];
    let encryptedData: String[]=[];
    _nonce.forEach(v=>nonce.push(v.toString()));
    _encryptedData.forEach((v: { toString: () => String; })=>encryptedData.push(v.toString()));
    return ({ encryptedData, nonce})
  }

  function decrypt(message:any){
    message = JSON.parse(message[0]);
    let decoded_message = nacl.box.open(new Uint8Array(message.encryptedData), new Uint8Array(message.nonce), sensor.publicKey, user.secretKey);
    let plain_text = nacl.util.encodeUTF8(decoded_message)
    return plain_text;
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
