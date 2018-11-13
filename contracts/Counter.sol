pragma solidity ^0.4.23;

contract Counter {
    uint256 public count;

    constructor() public {
        count = 0;
    }

    function increase() public {
        count++;
    }

    function decrease() public {
        count++;
    }
}