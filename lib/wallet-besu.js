const wallet = require('./wallet.js')

const saveOrionKey = function (orionKey) {
    localStorage.setItem("orionKey", orionKey)
}

const loadOrionKey = function () {
    return localStorage.getItem("orionKey")
}

const create = async function (password, orionKey) {
    if (password == null || password.length === 0 || orionKey == null || orionKey.length === 0)
        return false
    try {
        const entropy = "qwertyuioplkjhgfdsazxcvbnmqwertyuioplkjhgfdsazxcvbnmv"
        const walletStatus = await wallet.createWallet(password, entropy)
        if (walletStatus) {
            saveOrionKey(orionKey)
            return await wallet.addAccountEth(password)
        }
        return false
    } catch (err) {
        localStorage.clear()
        console.log("Create Wallet Error: ", err)
        return false
    }
}

const addAccount = async function (password, privateKey) {
    try {
        if (password == null || password.length === 0)
            return false

        if (privateKey == null || privateKey.length === 0) {
            return await wallet.addAccountEth(password)
        } else {
            return wallet.addAccountWeb3(password, privateKey)
        }
    } catch (err) {
        console.log("Add Account Error: ", err)
        return false
    }
}

const login = async function (password) {
    if (password == null || password.length === 0)
        return null
    try {
        return await wallet.getAllAccounts(password)
    } catch (err) {
        console.log("Error: ", err)
        return null
    }
}

module.exports = {
    create,
    addAccount,
    login,
    loadOrionKey
}