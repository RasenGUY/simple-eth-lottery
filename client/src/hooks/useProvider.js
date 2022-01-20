import { useMemo } from 'react';
import Web3 from 'web3';

export function useProvider(id) {
    const providers = { infura: "https://ropsten.infura.io/v3/", alchemy: "https://eth-ropsten.alchemyapi.io/v2/"};
    const IDS = { infura: process.env.REACT_APP_INFURA_ROPSTEN_ID, alchemy: process.env.REACT_APP_ALCHEMY_ROPSTEN_ID}

    return useMemo(() => {
        return new Web3(`${providers[process.env.REACT_APP_PROVIDER] }${IDS[process.env.REACT_APP_PROVIDER]}`);
    }, [id]);
}
