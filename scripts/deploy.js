const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const initialSupply = ethers.parseUnits("202500000000", 18);
  const KPOPProtocol = await ethers.getContractFactory("KPOPProtocol");
  const token = await KPOPProtocol.deploy(initialSupply);
  await token.waitForDeployment();
  const address = await token.getAddress();
  console.log("KPOPProtocol deployed to:", address);

  const filePath = path.join(__dirname, "..", "token-address.json");
  fs.writeFileSync(filePath, JSON.stringify({ KPOPProtocol: address }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
