const GameLottery = artifacts.require("GameLottery");
const BN = web3.utils.BN;
module.exports = async function (deployer, networks, accounts) {
    const owner = accounts[0]; // owners account
        
    if (networks === 'ropsten'){
        await deployer.deploy(GameLottery, {from: owner});
    } else {
        await deployer.deploy(GameLottery, {from: owner});
    }
};
