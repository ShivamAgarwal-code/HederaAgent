// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleStorage
 * @dev A simple contract to store and retrieve a number
 */
contract SimpleStorage {
    uint256 private storedData;
    address private owner;
    
    event DataChanged(uint256 newValue, address changedBy);

    constructor(uint256 initialValue) {
        storedData = initialValue;
        owner = msg.sender;
    }

    /**
     * @dev Store a new value
     * @param x The new value to store
     */
    function set(uint256 x) public {
        storedData = x;
        emit DataChanged(x, msg.sender);
    }

    /**
     * @dev Get the stored value
     * @return The current stored value
     */
    function get() public view returns (uint256) {
        return storedData;
    }
    
    /**
     * @dev Get the contract owner
     * @return The address of the owner
     */
    function getOwner() public view returns (address) {
        return owner;
    }
}