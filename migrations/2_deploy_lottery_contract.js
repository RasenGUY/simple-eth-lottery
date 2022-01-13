const GameLottery = artifacts.require("GameLottery");
const BN = web3.utils.BN;
module.exports = async function (deployer, networks, accounts) {
    const owner = accounts[0]; // owners account
    const price = new BN(3e-2); // price of ticket 
    const deadline = 20; // 1block is 10 - 15 seconds 
    const maxTickets = 15; // max of total tickets
    const maxUserTickets = 5; // max of user tickets 
    
    if (networks === 'ropsten'){
        await deployer.deploy(GameLottery, ...[price, deadline, maxTickets, maxUserTickets], {from: owner});
    } else {
        await deployer.deploy(GameLottery, ...[price, deadline, maxTickets, maxUserTickets], {from: owner});
    }
};
