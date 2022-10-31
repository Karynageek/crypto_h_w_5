// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interface/IBridgeToken.sol";

contract TokenBridge is AccessControl, ReentrancyGuard {
    bytes32 public constant BACKEND_ROLE = keccak256("BACKEND_ROLE");

    uint256 public nonce;

    mapping(uint256 => bool) public chains;
    mapping(uint256 => bool) public nonces;

    event Deposit(
        uint256 _chainId,
        address _depositToken,
        uint256 _amount,
        address _receiver
    );

    event Withdraw(address _token, address _receiver, uint256 _amount);

    constructor(address _backendAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BACKEND_ROLE, _backendAddress);
    }

    function deposit(
        uint256 _chainId,
        address _depositToken,
        uint256 _amount,
        address _receiver
    ) external {
        require(chains[_chainId] == true, "Chain id not exsisted");

        uint256 chainId_ = block.chainid;
        require(_chainId == chainId_, "Chain id is current net");

        IBridgeToken(_depositToken).burn(msg.sender, _amount);
        emit Deposit(_chainId, _depositToken, _amount, _receiver);
    }

    function setChain(uint256 chainid) external onlyRole(DEFAULT_ADMIN_ROLE) {
        chains[chainid] = true;
    }

    function withdraw(
        address _token,
        address _receiver,
        uint256 _amount,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external nonReentrant {
        require(nonces[nonce] == false, "Withdraw completed");

        uint256 chainId_ = block.chainid;

        bytes32 msgHash = getMsgHash(
            _token,
            _receiver,
            _amount,
            chainId_,
            nonce
        );

        require(
            validateSignature(
                ECDSA.toEthSignedMessageHash(msgHash),
                _v,
                _r,
                _s
            ),
            "Wrong signature"
        );

        IBridgeToken(_token).mint(_receiver, _amount);

        nonces[nonce] = true;
        nonce++;

        emit Withdraw(_token, _receiver, _amount);
    }

    function validateSignature(
        bytes32 _msgHash,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) private view returns (bool) {
        address recovered = ECDSA.recover(_msgHash, _v, _r, _s);

        return hasRole(BACKEND_ROLE, recovered);
    }

    function getMsgHash(
        address _token,
        address _receiver,
        uint256 _amount,
        uint256 _chainid,
        uint256 _nonce
    ) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(_token, _receiver, _amount, _chainid, _nonce)
            );
    }
}
