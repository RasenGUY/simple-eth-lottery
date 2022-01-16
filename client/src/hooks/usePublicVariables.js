import { useState, useEffect } from 'react';
import { useContract } from './';
import lotteryArtifact from '../abis/GameLottery.json'; 

export function usePublicVariables(setLoading) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const lottery = useContract(lotteryAddress, lotteryAbi);
    const [isActive, setIsActive] = useState(s => Number(s) === 0 ? true : false );
    const [lotteryId, setLotteryId] = useState();
    const [isOver, setIsOver] = useState();
    
    useEffect(() => {
        lottery.methods.lotteryState().call().then(setIsActive);
        lottery.methods.lotteryId().call().then(setLotteryId);
        lottery.methods.isLotteryOver().call().then(setIsOver);
    }, [setLoading]);
    
    return [isActive, lotteryId, isOver];
}
