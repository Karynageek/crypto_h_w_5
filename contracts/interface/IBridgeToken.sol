// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

interface IBridgeToken {
    function mint(address account, uint256 amount) external;

    function burn(address account, uint256 amount) external;
}
