// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

//import "./p2pm.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract Escrow {
  address admin;
  uint256 public totalBalance;

  // Token
  ERC20 token;

  struct Transaction {
    address buyer;
    uint256 amount;
    bool locked;
    bool spent;
  }

  mapping(address => mapping(uint => Transaction)) public balances;
  mapping(address => uint) public entero;

  modifier onlyOwner {
    require(msg.sender == admin, "Only admin can unlock escrow.");
    _;
  }

  constructor() {
    admin = msg.sender;
  }

  function aprueba(ERC20 _token, uint256 _amount) public {
    //_token.allowance(_address,address(this));
    _token.approve(address(this),_amount);
  }

  // seller accepts a trade, erc20 tokens
  // get moved to the escrow (this contract)
  function send(ERC20 _token,  uint256 _amount) payable public {
    _token.transfer(address(this), _amount);
  }

  // seller accepts a trade, erc20 tokens
  // get moved to the escrow (this contract)
  function accept(uint _tx_id, address _buyer, ERC20 _token,  uint256 _amount) external returns (uint256) {
    token = _token;
    
    token.transfer(address(this), _amount);
    totalBalance += _amount;
    balances[msg.sender][_tx_id].amount = _amount;
    balances[msg.sender][_tx_id].buyer = _buyer;
    balances[msg.sender][_tx_id].locked = true;
    balances[msg.sender][_tx_id].spent = false;
    return token.balanceOf(msg.sender);
  }

  // retrieve current state of transaction in escrow
  function transaction(address _seller, uint _tx_id) external view returns (uint256, bool, address) {
    return ( balances[_seller][_tx_id].amount, balances[_seller][_tx_id].locked, balances[_seller][_tx_id].buyer );
  }

  // admin unlocks tokens in escrow for a transaction
  function release(uint _tx_id, address _seller) onlyOwner external returns(bool) {
    balances[_seller][_tx_id].locked = false;
    return true;
  }

  // seller is able to withdraw unlocked tokens
  function withdraw(uint _tx_id) external returns(bool) {
    //require(balances[msg.sender][_tx_id].locked == false, 'This escrow is still locked');
    require(balances[msg.sender][_tx_id].spent == false, 'Already withdrawn');

    token.transfer(balances[msg.sender][_tx_id].buyer, balances[msg.sender][_tx_id].amount);

    totalBalance -= balances[msg.sender][_tx_id].amount;
    balances[msg.sender][_tx_id].spent = true;
    return true;
  }

  // admin can send funds to buyer if dispute resolution is in buyer's favor
  function resolveToBuyer(address _seller, uint _tx_id) onlyOwner external returns(bool) {
    token.transfer(balances[_seller][_tx_id].buyer, balances[msg.sender][_tx_id].amount);

    balances[_seller][_tx_id].spent = true;
    totalBalance -= balances[_seller][_tx_id].amount;
    return true;
  }


}
