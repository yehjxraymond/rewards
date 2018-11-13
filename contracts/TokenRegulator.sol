pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenRegulator is  Ownable {
    mapping (address => bool) public minters;

    function canMint(address _account) public view returns (bool) {
        return minters[_account];
    }

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