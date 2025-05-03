// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Counter {
    uint256 private count;
    
    // Constructor
    constructor() {
        count = 0;
    }
    
    // Increment function
    function increment() public {
        count += 1;
    }
    
    // Get count function
    function getCount() public view returns (uint256) {
        return count;
    }
}