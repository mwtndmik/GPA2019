pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol";

contract Lease is ERC721Full {
    using SafeMath for uint;

    constructor() public
    ERC721Full("Estate", "ZAT"){}

    struct Room {
        address realOwner,
        uint256 fee
    }

    Room[] public rooms;

    mapping (address => mapping(uint256 => Room)) ownerToRoom;

    uint256 private mintFee = 0 ether;

    mapping(address => uint) deposit;

    function deposit() internal payable{
      deposit[msg.sender] += msg.value;
    }

    function mintRoom(uint128 _fee) external payable returns(bool) {
        require(msg.sender != address(0));
        require(msg.value == mintFee);

        Room memory _room = Room({realOwner: msg.sender, uint128: _fee});
        uint256 tokenId = rooms.push(_room) - 1;
        ownerToRoom[msg.sender][tokenId] = _room;
        super._mint(msg.sender, tokenId);
        deposit();
        return true;
    }

    function transferRoom(address to, uint256 tokenId) external payable returns(bool) {
        require(msg.sender != address(0));
        require(msg.value == ownerToRoom[msg.sender][tokenId].fee.mul(3) )
        super._transferFrom(msg.sender, to, tokenId);
        return true;
    }

    function setRealOwnerFee(uint128 _fee) external onlyOwner {
        mintFee = _fee;
    }


}
