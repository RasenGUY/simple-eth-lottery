import React, { useState, useEffect } from 'react';
import { useContract } from './';
import  { useProvider } from './'; 
import lotteryArtifact from '../abis/GameLottery.json'; 
import { requestAction } from '../helpers'

export function useLotteryInformation(id) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const provider = useProvider(id);
    const lottery = useContract(lotteryAddress, lotteryAbi);
    const [ticketPrice, setTicketPrice] = useState();
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [maximumTickets, setMaximumTickets] = useState();
    // total tickets
    const [winner, setWinner] = useState();
    
    // calculate remaining time 
    const [timeLeft, setTimeLeft] = useState();
    
    
    useEffect(async () => {

        lottery.methods.ticketPrice().call().then(setTicketPrice);
        lottery.methods.startBlock().call().then(
            async s => {
                provider.eth.getBlock(Number(s)).then(({timestamp}) => setStart(timestamp)); // timestamp for start
                if(await lottery.methods.isLotteryOver().call()){ // get deadline timestamp of lottery if the lottery is over
                    lottery.methods.deadline().call().then(e => provider.eth.getBlock(Number(e)).then(({timestamp}) => setEnd(timestamp)));
                }
            });
        lottery.methods.deadline().call().then(e => 
            requestAction("get_remaining_blocktime", Number(e)).then(({result: {EstimateTimeInSec: est}}) => {
                let end = new Date(Date.now() + 1000 * Number(est));
                let start = new Date(Date.now());  
                let diff = Math.round((end.getTime() - start.getTime()) / 1000 / 60)
                setTimeLeft(diff)                
            })
        )
        lottery.methods.maxTickets().call().then(setMaximumTickets);
        lottery.methods.getWinner().call().then(setWinner);
        
    }, [id]);
    
    return [ticketPrice, Number(start), Number(end), timeLeft, maximumTickets, winner && winner.toUpperCase()];
}