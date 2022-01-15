const GameLottery = artifacts.require('GameLottery');

const { assert } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

// web3.setProvider('wss://ropsten.infura.io/ws/v3/2333808b589548f0af1e0ec117fbeac1');
const utils = web3.utils;
const toSha3 = web3.utils.soliditySha3;

contract("GameLottery", accounts => {
    
    var lottery;
    const [owner, alice, bob, carl, ed, fred, gerald, hilda, igmar, john] = accounts;
    
    var ticketPrice = utils.toWei("0.03", "ether"); // price of ticket
    var deadline = 20; // 1block is 10 - 15 seconds
    var maxTickets = 15; // max of total tickets
    var maxUserTickets = 5; // max of user tickets
    
    lotteryStates = {Active: 0, Inactive: 1}

    beforeEach(async () => {
        lottery = await GameLottery.new({from: owner });
    });
    
    describe("Contract Initialization", () => {
        it("sets the correct owner", async () => {
            const isOwner = await lottery.owner();
            assert.equal(isOwner, owner, "not correct owner set"); 
        });
        it("sets intializes lotteryId at 0", async () => {
            const corLotteryId = await lottery.lotteryId();
            assert.equal(corLotteryId.toNumber(), 0, "not correct owner set");
        });
        it("sets the correct lottery state", async () => {
            const corLotteryState = await lottery.lotteryState();
            assert.equal(corLotteryState, lotteryStates.Inactive, "not correct owner set");
        });
    });

    describe("Lottery Initialization", () => {
        it("allows only owner to create a new lottery", async ()=> {
            await expect(lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: alice})).to.be.rejected
        });
        it("sets the correct maxTickets", async () => {
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            const corMaxTickets = await lottery.maxTickets();
            assert.equal(corMaxTickets, maxTickets, "not correct maxtickets set");
        });
        it("sets the correct maxUserTickets", async () => {
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            const corMaxUserTickets = await lottery.maxUserTickets();
            assert.equal(corMaxUserTickets, maxUserTickets, "not correct maxuserTickets set");
        });
        it("sets the correct ticketPrice", async () => {
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            const correctTicketPrice = await lottery.ticketPrice();
            assert.equal(Number(correctTicketPrice.toString()), ticketPrice, "not correct ticketPrice set");
        });
        it("reverts if lotteryState is active", async () => {
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            await expect(lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner})).to.be.rejected
        });
        it("sets the correct deadline", async () => {
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            const startBlockNumber = await lottery.startBlock();
            const corDeadline = await lottery.deadline();
            assert.equal(corDeadline.toNumber(), startBlockNumber.toNumber() + deadline, "deadline not being set correctly");
        });
        it("increments lotteryId", async () => {
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            const lotteryId = await lottery.lotteryId();
            assert.equal(lotteryId.toNumber(), 1, "lotteryId does not increment correctly");
        });
    });

    describe("Buying tickets", () => {
        it("allows user not to buy tickets from inactive lotteries", async ()=> {
            await expect(lottery.buyTicket({from: alice})).to.be.rejected           
        });
        it("respects max tickets", async () => {
            let maxTickets = 5;
            let maxUserTickets = 2;
            let deadline = 60;
            await lottery.newLottery(deadline, new utils.BN(String(0.03 * 1e18)), maxTickets, maxUserTickets, {from: owner});
            await lottery.buyTicket({from: alice, value: ticketPrice });
            await lottery.buyTicket({from: alice, value: ticketPrice });
            await expect(lottery.buyTicket({from: alice, value: ticketPrice })).to.be.rejected; // respects user max tickets

            await lottery.buyTicket({from: bob, value: ticketPrice });
            await lottery.buyTicket({from: bob, value: ticketPrice });
            await lottery.buyTicket({from: carl, value: ticketPrice });
            await expect(lottery.buyTicket({from: fred, value: ticketPrice })).to.be.rejected; // respects user max tickets 
        });
        it("refunds user with leftover balance ticket balance", async ()=> {
            let maxTickets = 5;
            let maxUserTickets = 2;
            let deadline = 60;
            let ticketPrice = new utils.BN(String(0.03 * 1e18));
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            let balanceBefore = await web3.eth.getBalance(alice);
            await lottery.buyTicket({from: alice, value: utils.toWei("1", "ether")});
            let balanceAfter = await web3.eth.getBalance(alice);
            assert.equal(Number(Number(balanceBefore) * 1e-18 - balanceAfter * 1e-18).toFixed(2), Number(3e-2).toFixed(2), "does not refund correctly");
        });
    });    

    describe("Ending Lottery", () => {
        it("deactivates lottery when deadline is reached", async ()=> {
            let deadline = 6;
            let ticketPrice = new utils.BN(String(0.3 * 1e18));
            let maxTickets = 6;
            let maxUserTickets = 2;
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            await lottery.buyTicket({from: alice, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: bob, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: carl, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: ed, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: fred, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: gerald, value: utils.toWei("0.3", "ether")});
            await expect(lottery.buyTicket({from: gerald, value: utils.toWei("0.3", "ether")})).to.be.rejected; // deadline reached here 
        });
        it("calculates winners randomly", async () => {
            let deadline = 6;
            let ticketPrice = new utils.BN(String(0.3 * 1e18));
            let maxTickets = 6;
            let maxUserTickets = 2;
            
            // first lottery 
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            await lottery.buyTicket({from: alice, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: bob, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: carl, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: ed, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: fred, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: gerald, value: utils.toWei("0.3", "ether")});
            let { logs : logs1, winner1 = logs1[0].args.winner } = await lottery.calculateWinner({from: gerald });


            // second lottery 
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            await lottery.buyTicket({from: alice, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: bob, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: carl, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: ed, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: fred, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: gerald, value: utils.toWei("0.3", "ether")});
            let { logs: logs2, winner2 = logs2[0].args.winner } = await lottery.calculateWinner({from: gerald });
            assert.notEqual(winner1, winner2, "does not randomly select winners");
        });
        it("becomes inactive after winner is found", async ()=> {
            let deadline = 6;
            let ticketPrice = new utils.BN(String(0.3 * 1e18));
            let maxTickets = 6;
            let maxUserTickets = 2;
            
            // first lottery 
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            await lottery.buyTicket({from: alice, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: bob, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: carl, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: ed, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: fred, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: gerald, value: utils.toWei("0.3", "ether")});
            let { logs } = await lottery.calculateWinner({from: gerald });
            let lotteryState = await lottery.lotteryState(); 
            assert.equal(lotteryState.toNumber(), lotteryStates.Inactive, "lottery does not decativate after announcing winner");
        });
    });
    
    describe("Claiming prizes", ()=>{
        it("allows only winner to claim prize", async()=>{
            let deadline = 6;
            let ticketPrice = new utils.BN(String(0.3 * 1e18));
            let maxTickets = 6;
            let maxUserTickets = 2;
            
            // first lottery 
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            await lottery.buyTicket({from: alice, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: bob, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: carl, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: ed, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: fred, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: gerald, value: utils.toWei("0.3", "ether")});
            let { logs, winner = logs[0].args.winner } = await lottery.calculateWinner({from: gerald });
            await expect(lottery.withdrawPayments(winner, {from: hilda})).to.be.rejected
        });

        it("sends the correct prize money to the given address", async ()=> {
            let deadline = 6;
            let ticketPrice = new utils.BN(String(0.3 * 1e18));
            let maxTickets = 6;
            let maxUserTickets = 2;
            
            // first lottery 
            await lottery.newLottery(deadline, ticketPrice, maxTickets, maxUserTickets, {from: owner});
            await lottery.buyTicket({from: alice, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: bob, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: carl, value: utils.toWei("0.3", "ether")}); 
            await lottery.buyTicket({from: ed, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: fred, value: utils.toWei("0.3", "ether")});
            await lottery.buyTicket({from: gerald, value: utils.toWei("0.3", "ether")});
            let { logs, winner = logs[0].args.winner } = await lottery.calculateWinner({from: gerald });
            let prize = await lottery.payments(winner);
            let balanceBefore = await web3.eth.getBalance(winner);
            await lottery.withdrawPayments(winner, {from: winner}); 
            let balanceAfter = await web3.eth.getBalance(winner);
            assert.equal(Number((Number(prize.toString()) + Number(balanceBefore)) * 1e-18 ).toFixed(1), Number(balanceAfter * 1e-18).toFixed(1), "does not send correct prize to address"); 
        });
    })
})