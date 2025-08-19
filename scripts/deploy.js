const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const initialSupply = ethers.parseUnits("1000000", 18);
  const KPPToken = await ethers.getContractFactory("KPPToken");
  const token = await KPPToken.deploy(initialSupply);
  await token.waitForDeployment();
  const address = await token.getAddress();
  console.log("KPPToken deployed to:", address);

  const filePath = path.join(__dirname, "..", "token-address.json");
  fs.writeFileSync(filePath, JSON.stringify({ KPPToken: address }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
