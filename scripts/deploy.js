const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const HallyuToken = await ethers.getContractFactory("HallyuToken");
  const token = await HallyuToken.deploy(deployer.address);
  await token.waitForDeployment();
  const address = await token.getAddress();
  console.log("HallyuToken deployed to:", address);

  const filePath = path.join(__dirname, "..", "token-address.json");
  fs.writeFileSync(filePath, JSON.stringify({ HallyuToken: address }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
