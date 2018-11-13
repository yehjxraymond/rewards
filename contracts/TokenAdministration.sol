pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenAdministration is  Ownable {
    struct Merchant{
        string name;
        uint256 created;
    }

    mapping (address => bool) public approved;
    mapping (address => Merchant) public merchants;
    mapping (address => bool) public minters;

    // Public functions

    function register(string _name) public {
        require(!merchantIsSet(msg.sender), "Cannot re-register account");
        merchants[msg.sender].name = _name;
        merchants[msg.sender].created = block.number;
    }

    // Token administrators only

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

    function approveAccount(address _account) public onlyOwner{
        require(merchantIsSet(_account), "Account is not registered");
        approved[_account] = true;
    }

    function disapproveAccount(address _account) public onlyOwner{
        approved[_account] = false;
    }

    // Getter functions

    function canMint(address _account) external view returns (bool) {
        return minters[_account];
    }

    function canTransfer(address _from, address _to) external view returns (bool) {
        return (
            approved[_to] &&
            _from != address(0)
        );
    }

    // Internal functions

    function merchantIsSet(address _account) internal view returns (bool) {
        // solium-disable-next-line
        return (
            bytes(merchants[_account].name).length != 0 ||
            merchants[_account].created != 0
            || approved[_account]
        );
    }
}