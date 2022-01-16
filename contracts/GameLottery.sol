// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/utils/Address.sol"; 
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract GameLottery is PullPayment, Ownable, ReentrancyGuard {
    
    using Counters for Counters.Counter;
    
    struct Lottery {
        mapping(uint256 => uint256) startBlocks;
        mapping(uint256 => uint256) deadlines;
        mapping(uint256 => address) winner;
        mapping(address => Counters.Counter) lotteriesWon; 
        mapping(uint256 => uint256 []) blockNumbers;
        mapping(uint256 => address []) participants;
        mapping(uint256 => mapping(address => bool)) isParticipant;
        mapping(uint256 => mapping(address => Counters.Counter)) userTickets;
        mapping(uint256 => uint256) totalTicketsBought;
    }  

    enum LotteryStates { Active, Inactive }

    Lottery private lottery; 
    uint256 public maxTickets;
    uint256 public maxUserTickets;  
    uint256 public ticketPrice;
    LotteryStates public lotteryState;
    Counters.Counter public lotteryId;
    Counters.Counter public totalTickets; 

    event ChangeLotteryState(LotteryStates indexed newState);
    event AnnounceWinner(address indexed winner);
    event BuyTicket(address buyer, uint256 lotteryId);
    event Refund(address to, uint256 amount);
    event TicketPriceChanged(uint256 price);
    event CreateLottery(uint256 lotteryId);

    modifier onlyActiveLottery {
        require(lotteryState == LotteryStates.Active, "Lottery: inactive lottery");
        _;
    }

    modifier onlyCurrentWinner {
        require(lottery.winner[lotteryId._value] == msg.sender, "Lottery: only winner can claim prize");
        _;
    }

    modifier respectMaxTickets {
        _;
        require(lottery.userTickets[lotteryId._value][msg.sender]._value <= maxUserTickets, "Lottery: max number of tickets reached"); 
        require(totalTickets._value <= maxTickets, "Lottery: max number of tickets reached");
    }
    
    modifier onlyParticipant {
        require(lottery.isParticipant[lotteryId._value][msg.sender], "Lottery: caller not a participant");
        _;
    }

    modifier respectDeadline {
        require(block.number < lottery.deadlines[lotteryId._value], "Lottery: lottery reached deadline");
        _;
    }

    /// @notice initialize the first loterry
    constructor() {
        lotteryId._value = 0;
        lotteryState = LotteryStates.Inactive; 
    }

    /// @dev buy a lottery ticket with this function 
    /// @notice lottery has to be active for people to be able to ticket 
    function buyTicket() public payable onlyActiveLottery respectMaxTickets respectDeadline {
        require(msg.value >= ticketPrice, "Lottery: not enough funds"); 
        lottery.participants[lotteryId._value].push(address(msg.sender));
        lottery.blockNumbers[lotteryId._value].push(block.number + 1 + lottery.blockNumbers[lotteryId._value].length);
        totalTickets.increment(); 
        lottery.userTickets[lotteryId._value][msg.sender].increment();
        lottery.isParticipant[lotteryId._value][msg.sender] = true;
        if (msg.value > ticketPrice){
            uint256 rest = calculateRest(msg.value);
            refundRest(msg.sender, rest);
            emit Refund(msg.sender, rest);
        }
        emit BuyTicket(msg.sender, lotteryId._value);
    }

    /// @dev actives the lottery 
    /// @param _deadline time after lottery should be closed
    /// @param _ticketPrice price of the a ticket during the lottery
    /// @param _maxTickets maximum amount of tickets to be sold during this lottery
    /// @param _maxUserTickets maximum amount of tickets a user can buy during this lottery
    /// @notice _returns lottery Id 
    function newLottery (
        uint256 _deadline, 
        uint256 _ticketPrice, 
        uint256 _maxTickets, 
        uint256 _maxUserTickets) external onlyOwner {
        require(lotteryState == LotteryStates.Inactive, "Lottery: lottery is still active");
        lotteryState = LotteryStates.Active;
        lotteryId.increment();
        maxTickets = _maxTickets;
        maxUserTickets = _maxUserTickets;
        totalTickets._value = 0;
        ticketPrice = _ticketPrice;
        lottery.startBlocks[lotteryId._value] = block.number + 1;
        lottery.deadlines[lotteryId._value] = block.number + 1 + _deadline;
        emit ChangeLotteryState(LotteryStates.Active);
        emit CreateLottery(lotteryId._value);
    } 

    /// @dev calculates the winner of the lottery
    /// @notice generates random number from random block number and random user address
    /// @notice increments lotteries of a participant
    /// @notice deactivates current lottery
    /// @notice stores total tickets bought during current lottery round
    /// @notice transfers prize to escrow
    function calculateWinner() external 
    onlyActiveLottery returns (address) {
        require(isLotteryOver(), "Lottery: lottery still running");
        address _winner;
        
        if(lottery.participants[lotteryId._value].length < 1){
            _winner = address(0);
            lottery.winner[lotteryId._value] = _winner;
            lotteryState = LotteryStates.Inactive;        
            emit AnnounceWinner(_winner);
            return _winner; 
        }

        uint256 participantIndex = block.number % lottery.participants[lotteryId._value].length;
        uint256 blockNumberIndex = block.number % lottery.blockNumbers[lotteryId._value].length;
        uint256 winnerIndex = generateRandomNumber(participantIndex, blockNumberIndex);
        
        _winner = lottery.participants[lotteryId._value][winnerIndex];
        lottery.winner[lotteryId._value] = _winner; // winner
        lottery.lotteriesWon[_winner].increment(); // increments winner count of lottery winner
        lotteryState = LotteryStates.Inactive;
        lottery.totalTicketsBought[lotteryId._value] = totalTickets._value; 
        _asyncTransfer(lottery.winner[lotteryId._value], address(this).balance);
        emit AnnounceWinner(lottery.participants[lotteryId._value][winnerIndex]); 
        return _winner;
    }

    /// @dev returns the winner of the current lottery if there is one
    function getWinner() external view returns (address _winner){
        _winner = lottery.winner[lotteryId._value];
    }

    /// @dev returns the tickets owned by the caller of the function
    function ticketsOwned(address _participant) external view returns (uint256 _ticketsOwned) {
        _ticketsOwned = lottery.userTickets[lotteryId._value][_participant]._value;
    }

    /// @dev get lotteries won 
    function lotteriesWon(address _participant) external view returns (uint256 _lotteriesWon){
        _lotteriesWon = lottery.lotteriesWon[_participant]._value;
    }

    /// @dev checks whether lottery isOver
    function isLotteryOver() public view returns (bool) {
        if (block.number < lottery.deadlines[lotteryId._value]) return false;
        return true;
    } 

    /// @dev allows owner of lottery to set price of the ticket
    /// @param price new price of a ticket
    function setPrice(uint256 price) external onlyOwner {
        require(lotteryState == LotteryStates.Inactive, "Lottery: cannot change price of an active lottery");
        ticketPrice = price;
        emit TicketPriceChanged(price); 
    } 

    /// @dev retrieves lottery deadline
    function deadline() public view returns(uint256) {
        return lottery.deadlines[lotteryId._value];
    }

    /// @dev returns start block of current lottery if gameStarted
    function startBlock() public view returns (uint256 _startBlock){
        _startBlock = lotteryId._value != 0 ? lottery.startBlocks[lotteryId._value] : 0;
    }
    
    /// @dev generates a pseudo random number 
    /// @param participantIndex index for the participant array
    /// @param blockNumberIndex index for the blockNumber array
    function generateRandomNumber(
        uint256 participantIndex, 
        uint256 blockNumberIndex) 
    private view returns (uint indexWinner) {
        address randomParticipant = lottery.participants[lotteryId._value][participantIndex];
        bytes32 blHash = blockhash(lottery.blockNumbers[lotteryId._value][blockNumberIndex]); 
        indexWinner = uint(keccak256(abi.encodePacked(randomParticipant, blHash))) % lottery.participants[lotteryId._value].length; 
    }

    /// @dev calculate rest amount of eth to send back to users
    /// @param value amount the user will pay with
    function calculateRest(uint256 value) private view returns(uint256 rest){
        rest = value - ticketPrice; 
    }

    /// @dev refunds gas to a user if it exceeds lottery price
    /// @param to address to do a redund
    /// @param toRefund amount to refund 
    function refundRest(address to, uint256 toRefund) private {
        Address.sendValue(payable(to), toRefund); 
    }

    /// @dev allows winner of current lottery to withdraw payment
    /// @param payee address of recipient to whom amount will be sent
    function withdrawPayments(address payable payee) public override onlyCurrentWinner nonReentrant {
        require(lotteryState == LotteryStates.Inactive, "Lotery: lottery still ongoing");
        super.withdrawPayments(payee);
    }

    /// @dev get participants and blocknumbers
    /// @dev if empty function calls to contract
    fallback() external payable {}
    receive() external payable {}
}
