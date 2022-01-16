import React, {useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import { CreateLottery } from '../components/actions';
import { CalculateWinner } from '../components/actions';
import { BuyTicket } from '../components/actions';
import { ClaimPrize } from '../components/actions';
import { useAppContext } from '../AppContext';
import lotteryArtifact from '../abis/GameLottery.json';
import { useContract, useLotteryInformation } from '../hooks';

const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;

export const ActionsContainer = ({lotteryState, isOver, lotteryId}) => {
    const [admin, setAdmin] = useState(false);
    const [user, setUser] = useState();
    const {injectedProvider, setInjectedProvider } = useAppContext();
    const [ticketPrice, , , , , winner] = useLotteryInformation(lotteryId); 

    const lottery = useContract(lotteryAddress, lotteryArtifact.abi);
    const [loading, setLoading] = useState()

    useEffect( ()=> {

        if(injectedProvider){
            if (injectedProvider.selectedAddress == process.env.REACT_APP_ADMIN.toLowerCase()) {
                setAdmin(true);
            } else {
                setAdmin(false);
            }
            setUser(injectedProvider.selectedAddress.toUpperCase())
        } 

    }, [injectedProvider, setInjectedProvider]);
    return (
        <Container style={{width: "60%"}}>
            {
                !loading ? 
                <>
                    {
                        (injectedProvider && (admin && isOver) || (admin && Number(lotteryId) === 0)) &&
                        <CreateLottery
                        setLoading={setLoading} 
                        lottery={lottery} 
                        lotteryState={lotteryState} 
                        lotteryId={lotteryId}/>
                    }
                    {injectedProvider && !isOver ? <BuyTicket setLoading={setLoading} lottery={lottery} price={ticketPrice} /> : <BuyTicket setLoading={setLoading} disabled/>}
                    {(injectedProvider && isOver && Number(lotteryId) !== 0 && !lotteryState) && <CalculateWinner setLoading={setLoading} lottery={lottery} />}
                    {(injectedProvider && isOver && winner === user) && <ClaimPrize setLoading={setLoading} winner={winner} lottery={lottery}/>}
                </>
                : <h2>...Loading</h2>
            }
        </Container>
    )
}
