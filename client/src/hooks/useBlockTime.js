import React, {useState, useEffect} from 'react';
import { useProvider } from '../hooks'; 
import { timeDifference, requestAction} from '../helpers';

export function useBlockTime(deadline) { // returns number  
    const provider = useProvider();
    const [start, setStart] = useState();
    const [est, setEst] = useState(); 
    const [blockTime, setBlockTime] = useState();
    const avgBlocks = 100;
    
    useEffect(async () => {
        if(!start) provider.eth.getBlockNumber().then(setStart);
        if(start && !est){
            let {result: {EstimateTimeInSec: EST}} = await requestAction('get_remaining_blocktime', start + avgBlocks);
            setEst(EST);
        }
        if(est) setBlockTime(est/avgBlocks);
    }, [deadline]);
    
    return blockTime; 
}
