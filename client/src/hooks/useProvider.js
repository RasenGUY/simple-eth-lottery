import { useMemo } from 'react';
import Web3 from 'web3';

export function useProvider(id) {
    return useMemo(() => {
        return new Web3(`https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_ROPSTEN_ID}`);
    }, [id]);
}
