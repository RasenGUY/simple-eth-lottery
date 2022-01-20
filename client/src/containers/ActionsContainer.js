import React, {useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { CreateLottery } from '../components/actions';
import { CalculateWinner } from '../components/actions';
import { BuyTicket } from '../components/actions';
import { ClaimPrize } from '../components/actions';
import { useAppContext } from '../AppContext';
import lotteryArtifact from '../abis/GameLottery.json';
import { useContract, useLotteryInformation } from '../hooks';

const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;

export const ActionsContainer = ({lotteryActive, isOver, lotteryId, reload, setReload}) => {
    const [admin, setAdmin] = useState(false);
    const [user, setUser] = useState();
    const {injectedProvider, setInjectedProvider } = useAppContext();
    const {ticketPrice, winner} = useLotteryInformation(lotteryId); 
    const lottery = useContract(lotteryAddress, lotteryArtifact.abi);
    const [loading, setLoading] = useState();

    useEffect(()=> {
        let mounted = true; 
        if (mounted){
            if(injectedProvider){
                if (injectedProvider.selectedAddress === process.env.REACT_APP_ADMIN.toLowerCase()) {
                    setAdmin(true);
                } else {
                    setAdmin(false);
                }
                setUser(injectedProvider.selectedAddress.toUpperCase())
            }
        }
        return () => mounted = false;
        
    }, [injectedProvider, setInjectedProvider]);
    return (
        <Container style={{width: "60%"}}>
            {
                !loading ? 
                <>
                    {
                        ((injectedProvider && admin && (isOver && !lotteryActive)) || (admin && Number(lotteryId) === 0)) &&
                        <CreateLottery
                        setLoading={setLoading} 
                        lottery={lottery} 
                        lotteryId={lotteryId}
                        setReload={setReload}
                        />
                    }
                    {
                        injectedProvider && !isOver 
                        ? <BuyTicket 
                        setLoading={setLoading} 
                        lottery={lottery} 
                        price={ticketPrice}
                        setReload={setReload}
                        /> 
                        : <BuyTicket setLoading={setLoading} reload={reload} disabled/>}
                    {
                        !lotteryId ? null :
                        (injectedProvider && Number(lotteryId) !== 0 && (isOver || !lotteryActive)) && 
                        <CalculateWinner 
                        setLoading={setLoading} 
                        lottery={lottery} 
                        setReload={setReload}
                        />
                    }
                    {
                        (injectedProvider && isOver && winner === user) && 
                        <ClaimPrize 
                        setLoading={setLoading} 
                        winner={winner} 
                        lottery={lottery}
                        setReload={setReload}
                        />
                    }
                </>
                : <h2>...Loading</h2>
            }
        </Container>
    )
}
