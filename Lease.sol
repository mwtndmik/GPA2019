pragma solidity ^0.5.2;

import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Lease is ERC721Full {
    using SafeMath for uint256;

    constructor() public payable
    ERC721Full("LEthRoom", "LER"){}
    
    //event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    uint256 private mintFee = 0.1 ether;

    

    mapping(address => uint) private deposit;
    mapping(uint256 => uint) private paymentDay; //id =>
    mapping(uint256 => uint) private rent; //id => rent finneymapping(address => uint256[]) private _ownedTokens;
    mapping(address => address[]) private ownerToBuyers;
    mapping(address => uint256) private BuyerToTokenId;
    
    function setPaymentDay(uint256 tokenId) private {
        paymentDay[tokenId] = block.timestamp;
    }

    function canPayToOwner(uint256 tokenId) public view returns (bool) {
        return (block.timestamp >= paymentDay[tokenId].add(3 seconds));

    }

    function depositMoney() public payable {
        require(msg.sender != address(0));
        deposit[msg.sender] += msg.value;
    }

    function payToOwner() public {
        address[] memory buyerList = approvedAddressByOwner(msg.sender);
        require(buyerList.length > 0);
        for (uint i = 0; i< buyerList.length; i++){
            address buyerAddress = buyerList[i];
            uint256 roomId = BuyerToTokenId[buyerAddress];
            //購入者が存在するか  30日経過済みかどうか
            if (buyerAddress != address(0) && canPayToOwner(roomId)){
                uint irent = rent[roomId]; //finney
                //デポジットが足りてるかどうか
                if(deposit[buyerAddress] >= irent){
                    msg.sender.transfer(irent);
                    paymentDay[roomId] = block.timestamp;
                } else{
                    if(block.timestamp >= paymentDay[roomId].add(60 minutes)){
                        clearApproval(roomId, buyerAddress);
                    }
                }
            }
        }
    }

    function mintRoom(string memory _tokenURI, uint irent) public payable returns(uint256){
        require(msg.sender != address(0));
        require(msg.value >= mintFee);
        uint256 newTokenId = _getNextTokenId();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        rent[newTokenId] = irent;
        depositMoney();
        return newTokenId;
    }
    
    function ownerApprove(address to, uint256 newTokenId) public {
        approve(to, newTokenId);
        ownerToBuyers[msg.sender].push(to);
        BuyerToTokenId[to] = newTokenId;
        paymentDay[newTokenId] = block.timestamp;
    }

    function _getNextTokenId() private view returns (uint256) {
        return totalSupply().add(1);
    }
    
    function approvedAddressByOwner(address owner) internal view returns (address[] storage) {
        return ownerToBuyers[owner];
    }

    function clearApproval(uint256 tokenId, address buyer) public {
        address none = address(0);
        approve(none, tokenId);
        BuyerToTokenId[buyer] = 0;
        address[] memory buyerList = approvedAddressByOwner(msg.sender);
        for(uint i = 0; i < buyerList.length; i++) {
            address buyerAddress = buyerList[i];
            if(buyerAddress == buyer) {
                buyerAddress = address(0);
            }
        }
    }
}
