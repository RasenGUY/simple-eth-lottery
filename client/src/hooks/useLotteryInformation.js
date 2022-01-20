import { useState, useEffect } from 'react';
import { useContract } from './';
import  { useProvider } from './'; 
import lotteryArtifact from '../abis/GameLottery.json'; 
import {  useBlockTime } from './'
import { shortenAddress } from '../utils/shortenAddress';

export function useLotteryInformation(id, reload) {
    const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;
    const lotteryAbi = lotteryArtifact.abi;
    const provider = useProvider(id);
    const lottery = useContract(lotteryAddress, lotteryAbi);
    const blockTime = useBlockTime();
    const [lotteryInfo, setLotteryInfo] = useState({});

    useEffect(() => {
        let mounted = true;
        const getLotteryInfo = async () => {
            await Promise.all([
                lottery.methods.ticketPrice().call().then(r => setLotteryInfo(s => ({...s, ticketPrice: Number(r) * 1e-18 }))),
                lottery.methods.startBlock().call().then(start =>
                    provider.eth.getBlock(Number(start)).then(({timestamp}) => setLotteryInfo(s => ({...s, start: Number(timestamp)}))) // timestamp for start
                ),
                lottery.methods.isLotteryOver().call().then(isOver => {
                    setLotteryInfo(s => ({...s, isOver: Boolean(isOver)})); 
                    if (isOver)
                        lottery.methods.deadline().call().then(end => provider.eth.getBlock(Number(end))).then(({timestamp}) => setLotteryInfo(s => ({...s, end: Number(timestamp)})))
                }),
                lottery.methods.deadline().call().then(e => {
                    provider.eth.getBlockNumber().then(curr => setLotteryInfo(s => ({...s, timeLeft: ((Number(e) - Number(curr)) * blockTime) / 60})));
                }),
                lottery.methods.maxTickets().call().then(tickets => setLotteryInfo(s => ({...s, maxTickets: Number(tickets)}))),
                lottery.methods.getWinner().call().then(winner => setLotteryInfo(s => ({...s, winner: Number(winner) === 0 ? "no winner" : shortenAddress(winner)}))),
                lottery.methods.totalTickets().call().then(total => setLotteryInfo(s => ({...s, total: total})))
            ])
        }
        if (mounted){

            if(blockTime && Object.entries(lotteryInfo).length == 0){
                getLotteryInfo();
            }
        }
        return () => mounted = false; 
    }, [id, reload, setLotteryInfo, blockTime]);
    
    return lotteryInfo;
}
