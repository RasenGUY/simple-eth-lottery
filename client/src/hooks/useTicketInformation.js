import {useEffect, useState} from 'react';
import { useContract } from './';
import lotteryArtifact from '../abis/GameLottery.json'; 

export function useTicketInformation(id, address, reload) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const lottery = useContract(lotteryAddress, lotteryAbi);
    const [ticketInfo, setTicketInfo] = useState({});
    useEffect(()=>{
        let mounted = true; 
        const getTicketInfo = async () => {
            await Promise.all([
                lottery.methods.ticketsOwned(address).call().then(owned => setTicketInfo(s => ({...s, owned: owned}))),
                lottery.methods.lotteriesWon(address).call().then(won => setTicketInfo(s => ({...s, won: won}))),
                lottery.methods.maxUserTickets().call().then(max => setTicketInfo(s => ({...s, max: max})))
            ]);
        }
        if (mounted){
            if(address){
                getTicketInfo();
            }
        }
        return () => mounted = false;
    }, [id, address, reload, setTicketInfo]);
    return ticketInfo;
}
