const GameLottery = artifacts.require('GameLottery');

const { assert } = require('chai');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

web3.setProvider('ws://localhost:8545');
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
            await lottery.newLottery(deadline, new utils.BN(String(0.03 * 1e18)), maxTickets, maxUserTickets, {from: owner});
            let balanceBefore = await web3.eth.getBalance(bob);
            await lottery.buyTicket({from: bob, value: utils.toWei("1", "ether")});
            let balanceAfter = await web3.eth.getBalance(bob);
            assert.equal(Number(Number(balanceBefore) * 1e-18 - balanceAfter * 1e-18).toFixed(2), Number(3e-2).toFixed(2), "does not refund correctly");
        });
    });    

    describe("Ending Lottery", () => {

    });    
})