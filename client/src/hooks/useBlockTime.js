import {useState, useEffect} from 'react';
import { useProvider } from '../hooks'; 
import { range } from '../helpers';

export function useBlockTime(deadline) {
    const provider = useProvider();
    const [blockTime, setBlockTime] = useState();
    
    useEffect(() => {
        let mounted = true;
        let blocks = 250; 

        const getAverageBlockTime = async n => {
            const curr = await provider.eth.getBlockNumber(); 
            const numbers = range(Number(curr - n), Number(curr + 1), 1);
            const blocks = await Promise.all(numbers.map(n => provider.eth.getBlock(n)));
            const dates = blocks.map(({timestamp}) => new Date(timestamp * 1000));
            const differences = dates.map((date, index, dates) => index === dates.length - 1 ? undefined : (dates[index + 1] - date) / 1000);
            const sum = differences.slice(1, n).reduce((p, c) => p + c, differences[0]);
            return sum / differences.length - 1;
        };

        if (mounted) {            
            if(!blockTime){
                getAverageBlockTime(blocks).then(setBlockTime);
            }
        }

        return () => mounted = false;

    }, [deadline, blockTime]);
    
    return blockTime; 
}
