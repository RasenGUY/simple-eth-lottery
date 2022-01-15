const GameLottery = artifacts.require("GameLottery");
module.exports = async function (deployer, networks, accounts) {
    const owner = accounts[0]; // owners account
    if (networks === 'ropsten'){
        await deployer.deploy(GameLottery, {from: owner});
    } else {
        await deployer.deploy(GameLottery, {from: owner});
    }
};
