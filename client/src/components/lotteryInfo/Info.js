import React from 'react';
import { Card } from 'react-bootstrap';
import { shortenAddress } from '../../utils';
import { useLotteryInformation } from '../../hooks';

export const Info = ({lotteryId}) => {
    const [price, start, end, est, max, winner] = useLotteryInformation(lotteryId);

    return (
        <div className="flex-fill">
            <Card className="text-center" style={{padding: '2rem 0rem'}}>
                <Card.Title>Lottery Information</Card.Title>
                <Card.Body style={{textAlign: 'left'}}>
                    <Card.Text><b>ID: </b>{!lotteryId ? "...loading" : lotteryId}</Card.Text>
                    <Card.Text><b>Ticket Price: </b><span style={{fontSize: '0.8rem'}}>{!price ? "...loading" : String((Number(price) * 1e-18).toFixed(2)) + " ETH"}</span></Card.Text>
                    <Card.Text><b>Start: </b><span style={{fontSize: '0.8rem'}}>{!start ? "...loading" : String(new Date(start * 1000).toLocaleString()) }</span></Card.Text>
                    {end ? <Card.Text><b>End: </b><span style={{fontSize: '0.8rem'}}>{!end ? "...loading" : String(new Date(end * 1000).toLocaleString())}</span></Card.Text> : null}
                    {
                        !end ? 
                        <Card.Text><b>TimeLeft: </b><span style={{fontSize: '0.8rem'}}>
                            {
                                !est ? 
                                "...loading" : `less then 
                                    ${
                                        est >= 60 ? 
                                        est >= 24 * 60 ? 
                                        est >= 7 * 24 * 60 ? 
                                        `${Math.floor(est / (7* 24 * 60))} ws` : 
                                        `${Math.floor(est / (24 * 60))} ds` : 
                                        `${Math.floor(est / 60)} hrs` : 
                                        `${Math.floor(est)} min`
                                    }`
                            }</span></Card.Text> 
                        : null
                    }
                    <Card.Text><b>Max Tickets: </b><span style={{fontSize: '0.8rem'}}>{!max ? "...loading" : String(max)}</span></Card.Text>
                    <Card.Text><b>Winner: </b><span style={{fontSize: '0.8rem'}}>{!winner ? "loading" : shortenAddress(winner)} </span></Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
