const hre = require("hardhat");

var smartAddress;

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const hackContractFactory = await hre.ethers.getContractFactory("hack1");
  const hackContract = await hackContractFactory.deploy();

  // await counterContract.deployed();

  console.log(
    `Contract :  timestamp ${unlockTime} deployed to ${hackContract.target}`
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


