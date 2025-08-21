import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

const marketAddress = "0x0000000000000000000000000000000000000000"; // replace with deployed address
const marketAbi = [
  "function purchase(uint256 itemId) external"
];

async function purchaseItem(itemId) {
  if (!window.ethereum) {
    alert("Wallet not found");
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(marketAddress, marketAbi, signer);
  await contract.purchase(itemId);
}

document.querySelectorAll('[data-item-id]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const itemId = parseInt(btn.dataset.itemId, 10);
    try {
      await purchaseItem(itemId);
      alert(`Purchased item ${itemId}`);
    } catch (err) {
      console.error(err);
      alert('Purchase failed');
    }
  });
});
