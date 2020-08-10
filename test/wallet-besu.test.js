const assert = require('assert')
const besuFunctions = require('../lib/wallet-besu.js')

it('should create besu-wallet', async () => {
    const status = await besuFunctions.createUserWallet("password", "orionKey123")
    assert.strictEqual(status, true)
})

it('should add account without private key', async () => {
    const status = await besuFunctions.addAccount("password")
    assert.strictEqual(status, true)
})

it('should add account with private key', async () => {
    const status = await besuFunctions.addAccount("password",
        "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63")
    assert.strictEqual(status, true)
})

it('should get all accounts', async () => {
    const totalAccount = await besuFunctions.walletLogin("password")
    assert.strictEqual(totalAccount, 3)
})





