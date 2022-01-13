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
        mapping(uint256 => uint256) deadlines;
        mapping(uint256 => address) winner;
        mapping(uint256 => uint256 []) blockNumbers;
        mapping(uint256 => address []) participants;
        mapping(uint256 => mapping(address => Counters.Counter)) userTickets;
        mapping(uint256 => uint256) totalTicketsBought;
    }  

    enum LotteryStates { Active, Inactive }

    Lottery private lottery; 
    uint256 private ticketPrice;
    uint256 private maxTickets;
    uint256 private maxUserTickets;  
    
    LotteryStates public lotteryState;
    Counters.Counter public lotteryId;
    Counters.Counter public totalTickets; 

    event ChangeLotteryState (LotteryStates indexed newState);
    event AnnounceWinner (address indexed winner);
    event Refund(address to, uint256 amount);
    event TicketPriceChanged(uint256 price);

    modifier onlyActiveLottery {
        require(lotteryState == LotteryStates.Active, "Lottery: inactive lottery");
        _;
    }

    modifier onlyCurrentWinner {
        require(lottery.winner[lotteryId._value] == msg.sender);
        _;
    }

    modifier respectMaxTickets {
        _;
        require(lottery.userTickets[lotteryId._value][msg.sender]._value <= maxUserTickets, "Lottery: max number of tickets reached"); 
        require(totalTickets._value <= maxTickets, "Lottery: max number of tickets reached");
    }
    
    /// @notice initialize the first loterry
    constructor (uint256 _ticketPrice, uint256 _deadline, uint256 _maxTickets, uint256 _maxUserTickets){
        maxTickets = _maxTickets;
        maxUserTickets = _maxUserTickets; 
        lotteryId._value = 0;
        ticketPrice = _ticketPrice * 10 ** 18;
        lotteryState = LotteryStates.Active; 
        lottery.deadlines[lotteryId._value] = _deadline;
    } 

    /// @dev buy a lottery ticket with this function 
    /// @notice lottery has to be active for people to be able to ticket 
    function buyTicket() public payable onlyActiveLottery respectMaxTickets {
        require(msg.value >= ticketPrice, "Lottery: not enough funds"); 
        lottery.participants[lotteryId._value].push(address(msg.sender));
        lottery.blockNumbers[lotteryId._value].push(block.number + 1 + lottery.blockNumbers[lotteryId._value].length);
        totalTickets.increment(); 
        lottery.userTickets[lotteryId._value][msg.sender].increment();
        if (msg.value > ticketPrice){
            uint256 rest = calculateRest(msg.value);
            refundRest(msg.sender, rest);
            emit Refund(msg.sender, rest);
        }
    }

    /// @dev retrieves the ticket price 
    function getPrice() external view returns (uint256) {
        return ticketPrice; 
    }

    /// @dev actives the lottery 
    /// @param deadline time after lottery should be closed
    function newLottery(uint256 deadline, uint256 _maxTickets, uint256 _maxUserTickets) external onlyOwner {
        require(lotteryState == LotteryStates.Inactive, "Lottery: lottery not inactive");
        lotteryState = LotteryStates.Active;
        lotteryId.increment();
        maxTickets = _maxTickets;
        maxUserTickets = _maxUserTickets;
        totalTickets._value = 0;
        lottery.deadlines[lotteryId._value] = block.number + 1 + deadline;
        emit ChangeLotteryState(LotteryStates.Active);
    } 

    /// @dev calculates the winner of the lottery
    /// @param participantIndex index for blocknumbers list
    /// @param blockNumberIndex index for partipants list
    function calculateWinner(uint256 participantIndex, uint256 blockNumberIndex) public 
    onlyActiveLottery {
        uint256 winnerIndex = generateRandomNumber(participantIndex, blockNumberIndex);
        lottery.winner[lotteryId._value] = lottery.participants[lotteryId._value][winnerIndex];
        lotteryState = LotteryStates.Inactive;
        lottery.totalTicketsBought[lotteryId._value] = totalTickets._value; 
        _asyncTransfer(lottery.winner[lotteryId._value], address(this).balance);
    }

    /// @dev checks whether lottery isOver
    function isLotteryOver() public view returns (bool) {
        if (block.number < lottery.deadlines[lotteryId._value]){
            return false;
        }
        return true;
    } 

    /// @dev allows owner of lottery to set price of the ticket
    /// @param price new price of a ticket
    function setPrice(uint256 price) external onlyOwner {
        ticketPrice = price;
        emit TicketPriceChanged(price); 
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
        rest = (value - ticketPrice); 
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

    /// @dev if empty function calls to contract
    fallback() external payable {}
    receive() external payable {}
}
