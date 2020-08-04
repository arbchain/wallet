const Web3 = require('web3')
const {keystore} = require('eth-light')

let ethWallet;
let web3Wallet = new Web3("http://localhost:8545");

const initializeWeb3Wallet = function (entropy, password) {
    try {
        web3Wallet.eth.accounts.create(entropy)
        saveWeb3Wallet(password)
    } catch (err) {
        //console.log("Error:::"+err)
        throw err
    }
}

const initializeLightWallet = function (entropy, password) {
    try {
        const randomSeed = keystore.generateRandomSeed(entropy)
        const infoString = 'Your new wallet seed is: "' + randomSeed + '". Please save this seed';
        alert(infoString)
        keystore.createVault({
            password: password,
            seedPhrase: randomSeed,
            hdPathString: 'm/0\'/0\'/0\''
        }, function (err, ks) {
            ethWallet = ks;
            saveEthWallet()
        })
    } catch (err) {
        throw err
    }
}

const createWallet = function (password, entropy) {
    try {
        if (entropy == null || entropy.length === 0)
            entropy = prompt("Enter entropy:")
        if (password == null || password.length === 0)
            password = prompt("Enter password:")
        if (password == null || password.length === 0 || entropy == null || entropy.length === 0) {
            alert("Wallet creation cancelled!")
            return;
        }
        initializeWeb3Wallet(entropy, password)
        initializeLightWallet(entropy, password)
        alert("Wallet created successfully!")
    } catch (err) {
        alert("Wallet creation failed due to:" + err)
    }
}

const saveEthWallet = function () {
    try {
        const serialized_keystore = ethWallet.serialize()
        localStorage.setItem("ethWallet", serialized_keystore);
    } catch (err) {
        throw err
    }
}

const saveWeb3Wallet = function (password) {
    try {
        web3Wallet.eth.accounts.wallet.encrypt(password)
        return web3Wallet.eth.accounts.wallet.save(password, "web3Wallet");
    } catch (err) {
        throw err
    }
}

const addAccountEth = function (password) {
    try {
        loadEthWallet()
        if (ethWallet == null) {
            alert("No wallet found. Please create a wallet")
            return
        }
        if (password == null || password.length === 0)
            password = prompt('Enter password:');
        if (password == null || password.length === 0) {
            alert("Process cancelled. Password required!");
            return;
        }
        ethWallet.keyFromPassword(password, function (err, pwDerivedKey) {
            ethWallet.generateNewAddress(pwDerivedKey, 1);
            //const address = ethWallet.getAddresses();
            saveEthWallet()
            alert("Account added!")
        });
    } catch (err) {
        alert("Cannot add account due to : " + err)
    }
}

const addAccountWeb3 = function (password) {
    try {
        if (password == null || password.length === 0)
            password = prompt("Enter password:")
        if (password == null || password.length === 0) {
            alert("Password required!")
            return;
        }

        loadWeb3Wallet(password)
        if (web3Wallet == null) {
            alert("No wallet found. Please create a wallet!")
            return
        }
        const privateKey = prompt("Enter account private key:")
        if (privateKey == null || privateKey.length === 0) {
            alert("Process cancelled. Private key not found!")
            return
        }
        web3Wallet.eth.accounts.wallet.add(privateKey)
        if (saveWeb3Wallet(password)) {
            alert("Account added!")
            return
        }
        alert("Cannot add account!")
    } catch (err) {
        alert("Cannot add account due to : " + err)
    }
}

const loadWeb3Wallet = function (password) {
    try {
        if (localStorage.hasOwnProperty("web3Wallet")) {
            web3Wallet.eth.accounts.wallet.load(password, "web3Wallet")
            return
        }
        web3Wallet = null
    } catch (err) {
        throw err
    }
}

const loadEthWallet = function () {
    try {
        const serialized_keystore = localStorage.getItem("ethWallet");
        if (serialized_keystore !== null)
            ethWallet = keystore.deserialize(serialized_keystore)
    } catch (err) {
        throw err
    }
}

const restoreSeed = function (password) {
    try {
        if (password == null || password.length === 0)
            password = prompt('Enter password:');
        if (password == null || password.length === 0) {
            alert("Process cancelled. Password required!")
            return;
        }
        loadEthWallet()
        if (ethWallet == null) {
            alert("No wallet found. Please create a wallet!")
            return
        }

        ethWallet.keyFromPassword(password, function (err, pwDerivedKey) {
            const seed = ethWallet.getSeed(pwDerivedKey);
            alert('Your seed is: "' + seed);
        });
    } catch (err) {
        alert("Cannot restore seed due to :" + err)
    }
}

const restoreWallet = function (password, seed) {
    try {
        if (password == null || password.length === 0)
            password = prompt('Enter password:');
        if (seed == null || seed.length === 0)
            seed = prompt("Enter seed:")
        if (password == null || password.length === 0 || seed == null || seed.length === 0) {
            alert("Process cancelled. Password or seed not found!")
            return
        }
        keystore.createVault({
            password: password,
            seedPhrase: seed,
            //random salt
            hdPathString: 'm/0\'/0\'/0\''
        }, function (err, ks) {
            ethWallet = ks;
            saveEthWallet()
            alert("Wallet restored!")
        });
    } catch (err) {
        alert("Cannot restore wallet due to :" + err)
    }
}

const clearWallet = function (password) {
    try {
        if (password == null || password.length === 0)
            password = prompt("Enter password:")
        if (password == null || password.length === 0) {
            alert("Process cancelled. Password required!")
            return
        }
        loadWeb3Wallet(password)
        if (web3Wallet == null) {
            alert("No wallet found!")
            return
        }
        web3Wallet.eth.accounts.wallet.clear()
        if (saveWeb3Wallet(password)) {
            restoreWallet(password)
            alert("Removed all accounts!")
        }
    } catch (err) {
        alert("Cannot clear wallet due to :" + err)
    }
}

const getAllAccounts = function(password){
    try{
        if (password == null || password.length === 0)
            password = prompt("Enter password:")
        if (password == null || password.length === 0){
            alert("Password required!")
            return
        }
        loadEthWallet()
        loadWeb3Wallet(password)
        if(ethWallet == null || web3Wallet == null) {
            alert("No wallet found!")
            return
        }
        let accounts = []

        ethWallet.keyFromPassword(password, function (err, pwDerivedKey) {
            let ethAccounts= ethWallet.getAddresses();
            ethAccounts.forEach((address) => {
                const prv_key = ethWallet.exportPrivateKey(address, pwDerivedKey)
                accounts.push(prv_key)
            })
            const length = web3Wallet.eth.accounts.wallet.length
            for (let i = 0; i < length; i++) {
                accounts.push(web3Wallet.eth.accounts.wallet[String(i)].privateKey)
            }
            alert(JSON.stringify(accounts))
        })
    }catch (err) {
        alert("Cannot get all accounts due to :" + err)
    }
}

module.exports = {
    createWallet,
    addAccountEth,
    addAccountWeb3,
    restoreSeed,
    restoreWallet,
    clearWallet,
    getAllAccounts
}
