import {useState, useEffect} from 'react';
import { useProvider } from '../hooks'; 
import { requestAction} from '../helpers';

export function useBlockTime(deadline) { // returns number  
    const provider = useProvider();
    const [start, setStart] = useState();
    const [est, setEst] = useState(); 
    const [blockTime, setBlockTime] = useState();
    const avgBlocks = 100;
    
    useEffect(() => {
        const getEst = async () => {
            let {result: {EstimateTimeInSec: EST}} = await requestAction('get_remaining_blocktime', start + avgBlocks);
            setEst(EST)
        }

        if(!start) provider.eth.getBlockNumber().then(setStart);
        
        if(start && !est){
            getEst();
        }
        
        if(est) setBlockTime(est/avgBlocks);
    }, [deadline]);
    
    return blockTime; 
}
