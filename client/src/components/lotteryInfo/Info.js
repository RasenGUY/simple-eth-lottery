import React from 'react';
import { Card } from 'react-bootstrap';
import { shortenAddress } from '../../utils';

export const Info = () => {
    return (
        <div className="flex-fill">
            <Card className="text-center" style={{padding: '2rem 0rem'}}>
                <Card.Title>Lottery Information</Card.Title>
                <Card.Body style={{textAlign: 'left'}}>
                    <Card.Text><b>ID: </b>{"some info goes here"}</Card.Text>
                    <Card.Text><b>Ticket Price: </b><span style={{fontSize: '0.8rem'}}>{true && String("some info")}</span></Card.Text>
                    <Card.Text><b>Start: </b><span style={{fontSize: '0.8rem'}}>{true && String("some info")}</span></Card.Text>
                    <Card.Text><b>End: </b><span style={{fontSize: '0.8rem'}}>{true && String("some info")}</span></Card.Text>
                    <Card.Text><b>Max Tickets: </b><span style={{fontSize: '0.8rem'}}>{true && String("some info")}</span></Card.Text>
                    <Card.Text><b>Winner: </b><span style={{fontSize: '0.8rem'}}>{true && String("some info")}</span></Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
