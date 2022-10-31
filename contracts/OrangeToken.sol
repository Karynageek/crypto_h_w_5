// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interface/IBridgeToken.sol";

contract OrangeToken is ERC20, IBridgeToken {
    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {}

    function mint(address _account, uint256 _amount) external override {
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) external override {
        _burn(_account, _amount);
    }
}
