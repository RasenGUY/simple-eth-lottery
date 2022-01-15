import React, {useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import { CreateLottery } from '../components/actions';
import { CalculateWinner } from '../components/actions';
import { BuyTicket } from '../components/actions';
import { ClaimPrize } from '../components/actions';
import {useAppContext} from '../AppContext';

export const ActionsContainer = ({setLoading}) => {
    const [admin, setAdmin] = useState(false);
    const { injectedProvider, setInjectedProvider } = useAppContext();
    const winner = false;
    const deadline = false; 
    
    useEffect( ()=> {
        if(injectedProvider && injectedProvider.selectedAddress == process.env.REACT_APP_ADMIN.toLowerCase()) {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
    }, [injectedProvider, setInjectedProvider])

    return (
        <Container style={{width: "60%"}}>
            {admin && <CreateLottery setLoading={setLoading} />}
            {injectedProvider ? <BuyTicket setLoading={setLoading} /> : <BuyTicket setLoading={setLoading} disabled/>}
            {deadline && <CalculateWinner setLoading={setLoading} />}
            {winner && <ClaimPrize setLoading={setLoading} />}
        </Container>
    )
}
