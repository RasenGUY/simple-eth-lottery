import axios from 'axios';
const apiKey = process.env.REACT_APP_ETHERSCAN
const baseUrl = "https://api-ropsten.etherscan.io/api"

export async function requestAction(type, payload){  
    let res;
    switch(type){
        case 'get_account_transactions':
            try {
                let counter = 0;
                res = await axios.get(baseUrl + `?module=account&action=txlist&address=${payload}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`);
                while (res.status !== 200){
                    if (counter > 9 && res.status !== 200){
                        throw new Error("something went wrong with fetching user transactions");
                    }
                    res = await requestAction('get_account_transactions', payload);
                    counter++;
                }
                return res.data;
            } catch (e){
                return e;
            }
        case 'get_remaining_blocktime':
            try {
                res = await axios.get(baseUrl + `?module=block&action=getblockcountdown&blockno=${payload}&apikey=${apiKey}`);
                return res.data;
            } catch (e){
                return e;
            }
        default:
            try {
                res = await axios.get(payload);
            } catch (e){
                res = e;
            }
            return res;
        } 
}


// https://api.etherscan.io/api?module=account&actions=txlist&address=0xa322BAfebb305bf55EAD5E03Fd6372c2574df6a3&startblock=0&endblock=99999999&sort=asc&apikey=7I4ZAYFAX1R7K4ZHXBMI315MY6UEQ7WZND