import React, { useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { LotteryInfo } from '../../components/lotteryInfo';
import { TicketInfo } from '../../components/ticketInfo';
import { ActionsContainer } from '../../containers/ActionsContainer';

export const Home = () => {
    const [loading, setLoading] = useState();
    
    return (
        <Container className="d-flex align-items-center" style={{height: "100vh"}}>
            <Container fluid className="d-flex flex-row justify-content-between" style={{position: "relative"}}>
                <LotteryInfo />
                <ActionsContainer setLoading={setLoading}/>
                <TicketInfo />
            </Container>
        </Container>
    )
}


