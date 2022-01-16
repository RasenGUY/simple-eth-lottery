import { useState, useEffect } from 'react';
import { useContract } from './';
import lotteryArtifact from '../abis/GameLottery.json'; 

export function useToClaim(address) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const lottery = useContract(lotteryAddress, lotteryAbi);    
    const [toClaim, setToClaim] = useState();

    useEffect(() => {
        lottery.methods.payments(address.toLowerCase()).call().then(setToClaim);
    }, [address]);
    
    return (Number(toClaim) * 1e-18).toFixed(2);
}
