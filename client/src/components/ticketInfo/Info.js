import React from 'react';
import { Card } from 'react-bootstrap';

export const Info = () => {
    return (
        <div className="flex-fill">
            <Card className="text-center" style={{padding: '2rem 0rem'}}>
                <Card.Title>Ticket Information</Card.Title>
                <Card.Body style={{textAlign: 'left'}}>
                    <Card.Text><b>Tickets Owned: </b>{"some info goes here"}</Card.Text>
                    <Card.Text><b>Lotteries Won: </b><span style={{fontSize: '0.8rem'}}>{true && String("some info")}</span></Card.Text>
                    <Card.Text><b>Max Tickets: </b><span style={{fontSize: '0.8rem'}}>{true && String("some info")}</span></Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
