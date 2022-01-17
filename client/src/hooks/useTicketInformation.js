import {useEffect, useState} from 'react';
import { useContract } from './';
import lotteryArtifact from '../abis/GameLottery.json'; 

export function useTicketInformation(id, address, reload) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const lottery = useContract(lotteryAddress, lotteryAbi);

    const [owned, setOwned] = useState();
    const [won, setWon] = useState();
    const [max, setMax] = useState();

    useEffect(()=>{
        if(address){
            lottery.methods.ticketsOwned(address).call().then(setOwned);
            lottery.methods.lotteriesWon(address).call().then(setWon);
        }
        lottery.methods.maxUserTickets().call().then(setMax);
    }, [id, address, reload]);

    return [owned, won, max];
}
