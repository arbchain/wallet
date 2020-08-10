const Web3 = require('web3')
const {keystore} = require('eth-light')

let ethWallet;
let web3 = new Web3("http://localhost:8545");
let web3Wallet

const initializeWeb3Wallet = function (entropy, password) {
    try {
        web3.eth.accounts.create(entropy)
        web3Wallet = web3.eth.accounts.wallet
        return saveWeb3Wallet(password)
    } catch (err) {
        throw err
    }
}

const initializeLightWallet = function (entropy, password) {
    try {
        const randomSeed = keystore.generateRandomSeed(entropy)
        const infoString = 'Your new wallet seed is: "' + randomSeed + '". Please save this seed';
        console.log(infoString)
        return new Promise((resolve) => {
            keystore.createVault({
                password: password,
                seedPhrase: randomSeed,
                hdPathString: 'm/0\'/0\'/0\''
            }, function (err, ks) {
                ethWallet = ks;
                resolve(saveEthWallet())
            })
        })
    } catch (err) {
        throw err
    }
}

const createWallet = async function (password, entropy) {
    try {
        if (initializeWeb3Wallet(entropy, password)) {
            return await initializeLightWallet(entropy, password)
        }
        return false
    } catch (err) {
        throw err
    }
}

const saveEthWallet = function () {
    try {
        const serialized_keystore = ethWallet.serialize()
        localStorage.setItem("ethWallet", serialized_keystore)
        return true
    } catch (err) {
        throw err
    }
}

const saveWeb3Wallet = function (password) {
    try {
        const encryptedValue = web3Wallet.encrypt(password)
        localStorage.setItem("web3Wallet", JSON.stringify(encryptedValue))
        return true
    } catch (err) {
        throw err
    }
}

const addAccountEth = function (password) {
    try {
        loadEthWallet()
        if (ethWallet == null || password == null || password.length === 0) {
            return false
        }
        return new Promise(function (resolve) {
            ethWallet.keyFromPassword(password, function (err, pwDerivedKey) {
                ethWallet.generateNewAddress(pwDerivedKey, 1);
                resolve(saveEthWallet())
            });
        })
    } catch (err) {
        throw err
    }
}

const addAccountWeb3 = function (password, privateKey) {
    try {
        loadWeb3Wallet(password)
        if (web3Wallet == null) {
            return false
        }
        web3Wallet.add(privateKey)
        return saveWeb3Wallet(password)
    } catch (err) {
        throw err
    }
}

const loadWeb3Wallet = function (password) {
    try {
        if (localStorage.hasOwnProperty("web3Wallet")) {
            const encryptedValue = localStorage.getItem("web3Wallet")
            web3Wallet = web3.eth.accounts.wallet.decrypt(JSON.parse(encryptedValue), password)
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
        if (web3 == null) {
            alert("No wallet found!")
            return
        }
        web3.eth.accounts.wallet.clear()
        if (saveWeb3Wallet(password)) {
            restoreWallet(password)
            alert("Removed all accounts!")
        }
    } catch (err) {
        alert("Cannot clear wallet due to :" + err)
    }
}

const getAllAccounts = function (password) {
    try {
        loadEthWallet()
        loadWeb3Wallet(password)
        if (ethWallet == null || web3 == null) {
            return false
        }
        let accounts = []

        return new Promise((resolve) => {
            ethWallet.keyFromPassword(password, function (err, pwDerivedKey) {
                let ethAccounts = ethWallet.getAddresses();
                ethAccounts.forEach((address) => {
                    const prv_key = ethWallet.exportPrivateKey(address, pwDerivedKey)
                    accounts.push(prv_key)
                })
                const length = web3.eth.accounts.wallet.length
                for (let i = 0; i < length; i++) {
                    accounts.push(web3.eth.accounts.wallet[String(i)].privateKey)
                }
                resolve(accounts)
            })
        })

    } catch (err) {
        throw err
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
