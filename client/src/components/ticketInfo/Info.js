import React, {useState, useEffect} from 'react';
import { Card } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';
import { useTicketInformation } from '../../hooks';

export const Info = ({lotteryId, reload}) => {
    const { injectedProvider, setInjectedProvider} = useAppContext();
    const [user, setUser] = useState();
    const info = useTicketInformation(lotteryId, user, reload);
    
    useEffect(()=>{
        if(injectedProvider) setUser(injectedProvider.selectedAddress);
    }, [setInjectedProvider, reload]);

    return (
        <div className="flex-fill">
            <Card className="text-center" style={{padding: '2rem 0rem'}}>
                <Card.Title>Ticket Information</Card.Title>
                <Card.Body style={{textAlign: 'left'}}>
                    <Card.Text><b>Tickets Owned: </b><span style={{fontSize: '0.8rem'}}>{!info.owned ? "...loading" : info.owned}</span></Card.Text>
                    <Card.Text><b>Lotteries Won: </b><span style={{fontSize: '0.8rem'}}>{!info.won ? "...loading" : String(info.won)}</span></Card.Text>
                    <Card.Text><b>Max User Tickets: </b><span style={{fontSize: '0.8rem'}}>{!info.max ? "...loading" : String(info.max)}</span></Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
