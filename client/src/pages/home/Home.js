import React, { useState, useEffect} from 'react';
import { Container, Card } from 'react-bootstrap';
import { LotteryInfo } from '../../components/lotteryInfo';
import { TicketInfo } from '../../components/ticketInfo';
import { ActionsContainer } from '../../containers/ActionsContainer';
import { useContract } from '../../hooks';
import lotteryArtifact from '../../abis/GameLottery.json';

export const Home = () => {
    const [loading, setLoading] = useState();
    const [lotteryId, setLotteryId] = useState();
    const lottery = useContract(process.env.REACT_APP_GAMELOTTERY_ADDRESS, lotteryArtifact.abi);
    // const {} = useLotteryInformation(id);

    useEffect(async ()=>{
        let id = await lottery.methods.lotteryId().call();
        setLotteryId(id)
    }, [])
    
    
    return (
        <Container className="d-flex align-items-center" style={{height: "100vh"}}>
            <Container fluid className="d-flex flex-row justify-content-between" style={{position: "relative"}}>
                <LotteryInfo lotteryId={lotteryId}/>
                <ActionsContainer setLoading={setLoading}/>
                <TicketInfo />
            </Container>
        </Container>
    )
}


