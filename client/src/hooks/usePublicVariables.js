import { useState, useEffect } from 'react';
import { useContract } from './';
import lotteryArtifact from '../abis/GameLottery.json'; 

export function usePublicVariables(setLoading, reload) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const lottery = useContract(lotteryAddress, lotteryAbi);
    const [isActive, setIsActive] = useState();
    const [lotteryId, setLotteryId] = useState();
    const [isOver, setIsOver] = useState();
    useEffect(() => {
        let mount = true;
        const getPublicInfo = async () => {
            await Promise.all([
                lottery.methods.lotteryState().call().then(s => setIsActive(() => Number(s) === 0 ? true : false)),
                lottery.methods.lotteryId().call().then(setLotteryId),
                lottery.methods.isLotteryOver().call().then(setIsOver),
            ]);
        }
        if(mount){
            getPublicInfo();
        }
        return () => mount = false;
    }, [setLoading, reload]);
    
    return [isActive, lotteryId, isOver];
}
