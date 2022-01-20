import React, { useState, useEffect} from 'react';
import { Container, Button } from 'react-bootstrap';
import { LotteryInfo } from '../../components/lotteryInfo';
import { TicketInfo } from '../../components/ticketInfo';
import { usePublicVariables } from '../../hooks';
import { ActionsContainer } from '../../containers/ActionsContainer';

export const Home = () => {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState();
    const [state, id, isOver] = usePublicVariables(setLoading, reload);
    
    useEffect(() => {
        let mounted = true;
        if(mounted){
            if(id && state && isOver){
                setLoading(false);
            } else {
                setLoading(true);
            }
        }
        return () => mounted = false;
    }, [loading, id, state, isOver, reload]);

    // console.log(reload)
    return (
        <Container className="d-flex align-items-center" style={{height: "100vh"}}>
            <Container fluid className="d-flex flex-row justify-content-between" style={{position: "relative"}}>
                <LotteryInfo lotteryId={id} reload={reload}/>
                <ActionsContainer lotteryActive={state} isOver={isOver} lotteryId={id} setReload={setReload} reload={reload} />
                <TicketInfo lotteryId={id} reload={reload}/>
            </Container>
        </Container>
    )
}


