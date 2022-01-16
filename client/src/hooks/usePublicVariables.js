import React, { useState, useEffect } from 'react';
import { useContract } from './';
import  { useProvider } from './'; 
import lotteryArtifact from '../abis/GameLottery.json'; 

export function usePublicVariables(setLoading) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const lottery = useContract(lotteryAddress, lotteryAbi);
    const [lotteryState, setLotteryState] = useState(lotteryState => Number(lotteryState) === 0 ? true : false );
    const [lotteryId, setLotteryId] = useState();
    const [isOver, setIsOver] = useState();
    
    useEffect(async () => {
        lottery.methods.lotteryState().call().then(setLotteryState);
        lottery.methods.lotteryId().call().then(setLotteryId);
        lottery.methods.isLotteryOver().call().then(setIsOver);
    }, [setLoading]);
    
    return [lotteryState, lotteryId, isOver];
}
