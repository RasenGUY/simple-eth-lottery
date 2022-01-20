import { useMemo } from 'react';
import { AddressZero } from '@ethersproject/constants';
import Web3 from 'web3';

export function useContract(contractAddress, ABI) {
    const providers = { infura: "https://ropsten.infura.io/v3/", alchemy: "https://eth-ropsten.alchemyapi.io/v2/"};
    const IDS = { infura: process.env.REACT_APP_INFURA_ROPSTEN_ID, alchemy: process.env.REACT_APP_ALCHEMY_ROPSTEN_ID}

    if (contractAddress === AddressZero) {
        throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
    }

    
    return useMemo(() => {
        const provider = new Web3(`${providers[process.env.REACT_APP_PROVIDER]}${IDS[process.env.REACT_APP_PROVIDER]}`);
        return new provider.eth.Contract(ABI, contractAddress);
    }, [ABI, contractAddress]);
}
