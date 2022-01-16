import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { callContract } from '../../helpers';
const utils = require('web3').utils;
const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;

export const BuyTicket = ({setLoading, disabled, lottery, price}) => {

    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm();
    const onSubmit = async d => {
        setLoading(true);
        const data = lottery.methods.buyTicket().encodeABI();
        const { transactionHash } = await callContract(lotteryAddress, data, price);
        alert(`ticket sucessfully bought txhash: ${transactionHash}`);
        setLoading(false);
        window.location.reload();
    }
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="mt-3"    >
            <Form.Group className="text-center">
                <h2>BuyTicket</h2>
            </Form.Group>
            <Form.Group className="mt-3" style={{width: "100%"}}>
                <Button variant="info" type="submit" style={{width: "inherit"}} disabled={disabled ? true : false }>Buy</Button> 
            </Form.Group>
        </Form>
    )
}
