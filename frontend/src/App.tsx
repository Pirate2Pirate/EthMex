import React from 'react';
import { OrderItem } from './OrderItem' 
import { ethers, providers } from "ethers";
import { useState, useEffect } from 'react';
import tokensJSON from './tokenlist.json';
const axios = require('axios').default;


/* Solo para ejemplo, quitar al rato */
const orders: Order[] = [
  {
    reputation: 5,
    price: 20,
    amountBase: 100,
    amountToken: 100,
  },
  {
    reputation: 4.7,
    price: 20.2,
    amountBase: 1000,
    amountToken: 1000,
  },
];

function App() {

  // Properties

  const [walletAddress, setWalletAddress] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const [toToken, setToken] = useState("USDC");
  const [displayedOrders, setOrders] = useState<Order[]>(
    [
      {
        reputation: 5,
        price: 20,
        amountBase: 100,
        amountToken: 100,
      },
      {
        reputation: 4.5,
        price: 20,
        amountBase: 200,
        amountToken: 200,
      }
    ]
  )
  // Helper Functions

  // Requests access to the user's META MASK WALLET
  // https://metamask.io
  async function requestAccount() {
    console.log('Requesting account...');

    //  Check if Meta Mask Extension exists 
    if(window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }

    } else {
      alert('Meta Mask not detected');
    }
  }

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setDisabled(false);

    }
  }

  async function calcPrice() {
    try {
      setDisabled(true)
      let tokens = tokensJSON.tokens;
      let newOrders: Order[] = [];
      for (let i = 0; i < 17; i++) {
        if (tokens[i].symbol === toToken){
          let address = tokens[i].address;
          let decimals = tokens[i].decimals;
          for (let j = 0; j < orders.length; j++){
            let fromAmount = orders[j].amountBase;
            let url = `https://polygon.api.0x.org/swap/v1/price?sellToken=USDC&buyToken=${address}&sellAmount=${fromAmount * 10**6}`;
            const response = await axios.get(url);
            let newOrder: Order = {
              reputation: orders[j].reputation,
              price: orders[j].price,
              amountBase: orders[j].amountBase,
              amountToken: response.data.buyAmount/(10**decimals),
            }
            console.log(newOrder);
            newOrders.push(newOrder);
            console.log(newOrders);
          }
        }
      }
      setOrders(newOrders);
      setDisabled(false);
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <div className="pure-g">
        <form className="pure-form">
          <fieldset>
            <label htmlFor="input-to-token">Token</label>
            <input type="text" placeholder="DAI" id="input-to-token"
            defaultValue={toToken} onChange={(e) => {
              setToken(e.target.value);
            }} />
            <button type="submit" className="pure-button pure-button-primary"
            onClick={(e) => {
              e.preventDefault();
              calcPrice();
            }}>Quote</button>
          </fieldset>
        </form>
      </div>
      <div className="pure-g">
        <div className="pure-u-4-5">
          <div className="pure-u-1-4">
            <p>Reputation</p>
          </div>
          <div className="pure-u-1-4">
            <p>Price</p>
          </div>
          <div className="pure-u-1-4">
            <p>Amount USD</p>
          </div>
          <div className="pure-u-1-4">
            <p>Amount {toToken}</p>
          </div>
        </div>
      </div>
      <div className="pure-g">
        <OrderItem order={displayedOrders[0]} />
        <div className="pure-u-1-5">
          <button className="pure-button" type="button" disabled={isDisabled}>Compra</button>
        </div>
      </div>
      <div className="pure-g">
        <OrderItem order={displayedOrders[1]} />
        <div className="pure-u-1-5">
          <button className="pure-button" type="button" disabled={isDisabled} onClick={calcPrice}>Compra</button>
        </div>
      </div>
      <button onClick={connectWallet}>Connect</button>
      <h3>Wallet Address: {walletAddress}</h3>
    </div>
  );
}

export default App;
