const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.deployContract("SwisstronikTestERC20");  

  await contract.waitForDeployment();

  console.log(`SwisstronikTestERC20 contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});