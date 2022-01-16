import React, { useState, useEffect} from 'react';
import { Container, Card } from 'react-bootstrap';
import { LotteryInfo } from '../../components/lotteryInfo';
import { TicketInfo } from '../../components/ticketInfo';
import { usePublicVariables } from '../../hooks';
import { ActionsContainer } from '../../containers/ActionsContainer';

export const Home = () => {
    const [loading, setLoading] = useState(true);
    const [state, id, isOver] = usePublicVariables(setLoading);
    
    useEffect(() => {
        if(id && state && isOver){
            setLoading(false);
        }
    }, [loading]);
    
    return (
        <Container className="d-flex align-items-center" style={{height: "100vh"}}>
            <Container fluid className="d-flex flex-row justify-content-between" style={{position: "relative"}}>
                <LotteryInfo lotteryId={id} />
                <ActionsContainer lotteryState={state} isOver={isOver} lotteryId={id} />
                <TicketInfo lotteryId={id}/>
            </Container>
        </Container>
    )
}


