pragma solidity ^0.5.2;

import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Lease is ERC721Metadata, ERC721Full {
    using SafeMath for uint256;

    constructor() public payable
    ERC721Full("Estate", "ZAT"){}

    uint256 private mintFee = 0.1 ether;
    
    
    mapping(address => uint) deposit;
    mapping(address => uint) public timeStamp;
    
    function set() public {
        timeStamp[msg.sender] = block.timestamp;
    }
    
    function get() public view returns (bool) {
        require(block.timestamp >= timeStamp[msg.sender].add(30 days));
        return true;
    }

    function depositMoney() internal {
      deposit[msg.sender] += msg.value;
    }

    function mintRoom(string memory _tokenURI) public payable returns(bool){
        require(msg.sender != address(0));
        require(msg.value == mintFee);
        uint256 newTokenId = _getNextTokenId();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        depositMoney();
        return true;
    }
    
    function _getNextTokenId() private view returns (uint256) {
        return totalSupply().add(1); 
    }
    
    function clearApproval(uint256 tokenId) public {
        address none = address(0);
        approve(none, tokenId);
    }
    
    
    
}

