import React,{Component} from 'react';
const wallet = require('wallet-besu');

class Wallet extends Component {

    render() {
        return(
            <div className="wallet">
                <button onClick={() => wallet.create("password","orionKey123")}>Create Wallet</button>
                <button onClick={() => wallet.addAccount("password")}>Add Account</button>
                <button onClick={() => wallet.addAccount("password",
                    "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63")}>Add Account using key</button>
                <button onClick={() => wallet.login("password")}>Login to Wallet</button>
            </div>
        )
    }
}

export default Wallet;