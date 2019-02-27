pragma solidity ^0.5.2;

import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Lease is ERC721Metadata, ERC721Full {
    using SafeMath for uint256;

    constructor() public payable
    ERC721Full("LEthRoom", "LER"){}

    uint256 private mintFee = 0.1 ether;


    mapping(address => uint) deposit;
    mapping(uint256 => uint) paymentDay; //id =>
    mapping(uint256 => uint) rent; //id => rent finney

    function initPaymentDay(uint256 tokenId) private {
        paymentDay[tokenId] = block.timestamp;
    }

    function canPayToOwner(uint256 tokenId) public view returns (bool) {
        return (block.timestamp >= paymentDay[tokenId].add(30 days));

    }

    function depositMoney() public payable {
        require(msg.sender != address(0));
        deposit[msg.sender] += msg.value;
    }

    function payToOwner() public {
        uint256[] memory ownerRoomList = _tokensOfOwner(msg.sender);
        require(ownerRoomList.length > 0);

        //roomId loop
        for (uint i = 0; i< ownerRoomList.length; i++){
            uint256 roomId = ownerRoomList[i];
            address buyerAddress = getApproved(roomId);
            uint totalPay = 0;

            //購入者が存在するか  30日経過済みかどうか
            if (buyerAddress != address(0) && canPayToOwner(roomId)){
                uint irent = rent[roomId];//wei
                uint ipaymentDay = paymentDay[roomId];

                //切り捨てが前提
                uint needPayTime = (block.timestamp - ipaymentDay) / (30 days);
                uint canPayTime = deposit[buyerAddress] / irent;

                //普通に払える場合
                if(canPayTime >= needPayTime){
                  irent = irent * needPayTime;
                  paymentDay[roomId] = paymentDay[roomId].add((30 days) * needPayTime);
                }else{
                  //全ては払えない場合
                  irent = irent * canPayTime;
                  paymentDay[roomId] = paymentDay[roomId].add((30 days) * canPayTime);
                  //2ヶ月以上滞納している場合
                  if(needPayTime - canPayTime >= 2){ clearApproval(roomId); }
                }

                totalPay += irent;
                deposit[buyerAddress] -= irent;
            }
        }

        msg.sender.transfer(totalPay);
    }

    function mintRoom(string memory _tokenURI, uint irent) public payable returns(bool){
        require(msg.sender != address(0));
        require(msg.value >= mintFee);
        uint256 newTokenId = _getNextTokenId();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        rent[newTokenId] = irent;
        paymentDay[newTokenId] = block.timestamp;
        depositMoney();
        return true;
    }

    function _getNextTokenId() private view returns (uint256) {
        return totalSupply().add(1);
    }

    function ownerApprove(address to, uint256 newTokenId) public {
      approve(to, newTokenId);
      initPaymentDay(newTokenId);
    }

    function clearApproval(uint256 tokenId) private {
        address none = address(0);
        approve(none, tokenId);
    }
}
