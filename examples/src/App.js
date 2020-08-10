import React from 'react';
import './App.css';
import Wallet from './components/ComponentWallet.js'

function App() {
  return (
      <div className="App">
        <h1 className="header">Wallet using Web3 & eth-Light</h1>
        <Wallet/>
      </div>
  );
}

export default App;
