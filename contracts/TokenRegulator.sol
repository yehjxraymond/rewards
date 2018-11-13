pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenRegulator is  Ownable {
    mapping (address => bool) public minters;

    function allowMinting(
        address _mintingAddress
    ) public onlyOwner{
        minters[_mintingAddress] = true;
    }

    function disallowMinting(
        address _mintingAddress
    ) public onlyOwner{
        minters[_mintingAddress] = false;
    }
}