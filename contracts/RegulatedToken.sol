pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

import "./TokenRegulator.sol";

contract RegulatedToken is ERC20, ERC20Detailed {
    TokenRegulator public tokenRegulator;

    constructor(
        string name,
        string symbol,
        uint8 decimals,
        address regulator
    ) ERC20Detailed(name, symbol, decimals) public {
        tokenRegulator = TokenRegulator(regulator);
    }

    modifier onlyMinter(address _account){
        require(tokenRegulator.canMint(_account), "Account is not allowed to mint");
        _;
    }

    function mint(
        address to,
        uint256 amount
    ) public onlyMinter(msg.sender) {
        _mint(to, amount);
    }
}