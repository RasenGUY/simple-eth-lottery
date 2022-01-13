const GameLottery = artifacts.require("GameLottery");
const BN = web3.utils.BN;
module.exports = async function (deployer, networks, accounts) {
    const owner = accounts[0]; // owners account
    const price = new BN(3e-2); // price of ticket 
    const deadline = 20; // 1block is 10 - 15 seconds 
    
    if (networks === 'ropsten'){
        /// deploy to ropsten here
        deployer.deploy(GameLottery, ...[price, deadline], {from: owner});
    } else {
        await deployer.deploy(GameLottery, ...[price, deadline], {from: owner});
        const lottery = await GameLottery.deployed();
        console.log(await lottery.owner());
    }
};
