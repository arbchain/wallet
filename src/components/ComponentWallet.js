import React,{Component} from 'react';
const walletFunction = require('../lib/wallet.js')

class Wallet extends Component {

    render() {
        return(
            <div className="wallet">
                <button onClick={() => walletFunction.createWallet()}>Create Wallet</button>
                <button onClick={() => walletFunction.addAccountEth()}>Add Account</button>
                <button onClick={() => walletFunction.addAccountWeb3()}>Add Account using key</button>
                <button onClick={() => walletFunction.restoreWallet()}>Restore Wallet</button>
                <button onClick={() => walletFunction.restoreSeed()}>Restore seed</button>
                <button onClick={() => walletFunction.clearWallet()}>Clear Wallet</button>
                <button onClick={() => walletFunction.getAllAccounts()}>Get All Accounts</button>
            </div>
        )
    }
}

export default Wallet;