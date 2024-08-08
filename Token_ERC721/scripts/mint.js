const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x9aB418c70DA0c90E967Ae0faC3B6b5445884DA94";
  const recipientAddress = "0xB0Bc6c1453603CdDF19a004b1aB8216c1BfA6c5e"; 

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("Pudiny"); 
  const contract = contractFactory.attach(contractAddress);

  const functionName = "mint";
  const functionArgs = [recipientAddress]; 
  const txData = contract.interface.encodeFunctionData(functionName, functionArgs);

  try {
    console.log("Wait a min!");

    const mintTx = await sendShieldedTransaction(
      signer,
      contractAddress,
      txData,
      0
    );

    await mintTx.wait();

    console.log("Done!");
    console.log("Receipt: ", mintTx);
  } catch (error) {
    console.error("Failed: ", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
