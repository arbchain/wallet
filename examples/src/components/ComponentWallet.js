import React,{Component} from 'react';
const walletFunction = require('../../../lib/wallet-besu.js');

class Wallet extends Component {

    render() {
        return(
            <div className="wallet">
                <button onClick={() => walletFunction.create("password","orionKey123")}>Create Wallet</button>
                <button onClick={() => walletFunction.addAccount("password")}>Add Account</button>
                <button onClick={() => walletFunction.addAccount("password",
                    "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63")}>Add Account using key</button>
                <button onClick={() => walletFunction.login("password")}>Login to Wallet</button>
            </div>
        )
    }
}

export default Wallet;