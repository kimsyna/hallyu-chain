import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { showNotice } from "./main.js";

const marketAbi = ["function purchase(uint256 itemId) external"];

async function resolveMarketAddress() {
  const envAddress =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.METAVERSE_MARKET_ADDRESS) ||
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      (import.meta.env.VITE_METAVERSE_MARKET_ADDRESS ||
        import.meta.env.METAVERSE_MARKET_ADDRESS));
  if (envAddress) return envAddress;
  try {
    const resp = await fetch("./token-address.json");
    const data = await resp.json();
    return data?.MetaverseMarket;
  } catch (err) {
    console.error("Failed to load token-address.json", err);
  }
  return null;
}

const marketAddressPromise = resolveMarketAddress();

async function purchaseItem(itemId) {
  if (!window.ethereum) {
    showNotice("Wallet not found");
    return;
  }
  const marketAddress = await marketAddressPromise;
  if (!marketAddress) {
    console.error("Market address not configured");
    showNotice("Market address not configured");
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(marketAddress, marketAbi, signer);
  try {
    await contract.purchase(itemId);
    showNotice(`Purchased item ${itemId}`);
  } catch (err) {
    console.error(err);
    showNotice("Purchase failed");
  }
}

document.querySelectorAll("[data-item-id]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const itemId = parseInt(btn.dataset.itemId, 10);
    purchaseItem(itemId);
  });
});
