// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/security/ReentrancyGaurd.sol"; 
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/utils/Address.sol"; 
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Lottery is PullPayment, Ownable, ReentrancyGaurd {
    
    using Counter for uint256;
    
    struct Lottery {
        mapping(uint256 => uint256) deadlines;
        mapping(uint256 => address) winner;
        mapping(uint256 => uint256 []) blockNumbers;
        mapping(uint256 => address []) participants;
    }  

    /// @notice lotery states
    enum LotteryStates { Active, Inactive }

    /// @notice lottery variables 
    Lottery private lottery; 
    LotteryStates lotteryState;
    uint256 private ticketPrice;
    Counter private lotteryId; 

    /// @notice events
    event ChangeLotteryState (LotteryStates indexed newState);
    event AnnounceWinner (address indexed winner);
    event Refund(address to, uint256 amount);
    event TicketPriceChanged(uint256 price);

    modifier onlyActiveLottery {
        require(lotteryState == LotteryStates.Active, "Lottery: inactive lottery");
        _;
    }

    modifier onlyCurrentWinner {
        require(lotery.winner[loteryId] == msg.sender);
    }

    /// @dev buy a lottery ticket with this function 
    /// @notice lottery has to be Active for people to be able to ticket 
    function buyTicket() public payable onlyActiveLottery {
        require(msg.value >= ticketPrice, "Lottery: not enough funds"); 
        lottery[lotteryId].participants.push(address(msg.sender));
        lottery[lotteryId].blockNumbers.push(block.number + lottery[lotteryId].blockNumbers.lenght());
        if (msg.value > lotteryPrice){
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
    /// @param deadline timestamp for closing the lottery
    function newLottery(uint256 deadline) external onlyOwner {
        require(lotteryState == lotteryStates.Inactive, "Lottery: lottery still ongoing");
        lotteryState = LotteryStates.Active;
        lotteryId.increment(); 
        lottery.deadlines[lotteryId] = deadline;
        emit ChangeLotteryState(LotteryStates.Active);
    } 

    /// @dev calculates the winner of the lottery
    /// @param participantIndex index for blocknumbers list
    /// @param blockNumberIndex index for partipants list
    function calculateWinner(uint256 participantIndex, blockNumberIndex) public 
    onlyActiveLottery {
        uint256 winnerIndex = generateRandomNumber(participantIndex, blockNumberIndex);
        lottery.winner[lotteryId] = lottery.participants[lotteryId][winnerIndex];
        lotteryState = lotteryState.Inactive;
        _asyncTransfer(lottery.winner[lotteryId], address(this).balance);
    }

    /// @dev checks whether lottery isOver
    function isLotteryOver() returns (bool) {
        if (block.timestamp * 1000 < lottery.deadlines[lotteryId] * 1000){
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
        uint256 _partipantIndex, 
        uint256 _blockNumberIndex) 
    private returns (uint indexWinner) {
        address randomParticipant = lottery.participants[lotteryId][participantIndex];
        bytes32 blHash = blockhash(lottery.blockNumbers[lotteryId][blockNumberIndex]); 
        indexWinner = uint(keccack256(randomParticipant , blHash)) % participants.length(); 
    }

    /// @dev calculate rest amount of eth to send back to users
    /// @param value amount the user will pay with
    function calculateRest(value) private returns (uint256 rest){
        rest = (value - lotteryPrice); 
    }

    /// @dev refunds gas to a user if it exceeds lottery price
    /// @param to address to do a redund
    /// @param toRefund amount to refund 
    function refundRest(address to, uint256 toRefund) private returns (bool) {
        Address.sendValue(to, toRefund); 
    }

    /// @dev allows winner of current lottery to withdraw payment
    /// @param payee address of recipient to whom amount will be sent
    function withdrawPayments(address payee) public override onlyCurrentWinner {
        require(lotteryState == LotteryStates.Inactive, "Lotery: lottery still ongoing");
        _escrow.withdraw(payable(payee));
    }

    /// @dev if empty function calls to contract
    fallback() external payable {}
}
