import React, { useState, useEffect } from 'react';
import { useContract } from './';
import  { useProvider } from './'; 
import lotteryArtifact from '../../abis/GameLottery.json'; 

export function useLotteryInformation(id) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const lottery = useContract(lotteryAddress, lotteryArtifact);
    const provider = useProvider(id);
    const [ticketPrice, setTicketPrice] = useState();
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [maximumTickets, setMaximumTickets] = useState();
    const [winner, setWinner] = useState();
    
    useEffect(() => {

    });
    
    return (
        <div>
            
        </div>
    )
}
