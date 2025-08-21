// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title HallyuNFT
/// @notice ERC721 token representing K-culture IP NFTs with mint, burn and breeding features
contract HallyuNFT is ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 public nextTokenId;

    struct BreedingPair {
        uint256 parent1;
        uint256 parent2;
    }

    /// @notice mapping from tokenId to its parents
    mapping(uint256 => BreedingPair) public parents;

    /// @dev emitted when a new NFT is bred from two parents
    event Bred(address indexed owner, uint256 indexed parent1, uint256 indexed parent2, uint256 newTokenId);

    constructor() ERC721("Hallyu NFT", "HNFT") Ownable(msg.sender) {}

    /// @notice mint a new NFT to `to` with metadata `uri`
    function mint(address to, string memory uri) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /// @notice breed two NFTs owned by caller to create a new one
    function breed(uint256 parent1, uint256 parent2, string memory uri) external returns (uint256) {
        require(ownerOf(parent1) == msg.sender, "Not owner of parent1");
        require(ownerOf(parent2) == msg.sender, "Not owner of parent2");
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        parents[tokenId] = BreedingPair(parent1, parent2);
        emit Bred(msg.sender, parent1, parent2, tokenId);
        return tokenId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

