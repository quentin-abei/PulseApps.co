
const hre = require("hardhat");

async function main() {
  
  const AppVote = await hre.ethers.getContractFactory("AppVote");
  const appvote = await AppVote.deploy();

  await appvote.deployed();

  console.log("AppVote deployed to:", appvote.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
