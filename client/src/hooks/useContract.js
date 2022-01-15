import { useMemo } from 'react';
import { AddressZero } from '@ethersproject/constants';
import Web3 from 'web3';

export function useContract(contractAddress, ABI) {

    if (contractAddress === AddressZero) {
        throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
    }
    
    return useMemo(() => {
        const provider = new Web3(`https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_ROPSTEN_ID}`);
        return new provider.eth.Contract(ABI, contractAddress);
    }, [ABI, contractAddress]);
}
