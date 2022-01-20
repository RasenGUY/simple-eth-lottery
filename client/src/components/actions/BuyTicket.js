import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { callContract } from '../../helpers';
const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;

export const BuyTicket = ({setLoading, disabled, lottery, price, setReload}) => {

    const { 
        handleSubmit
    } = useForm();
    const onSubmit = async d => {
        setLoading(true);
        const data = lottery.methods.buyTicket().encodeABI();
        try {
            const { transactionHash } = await callContract(lotteryAddress, data, String(price * 1e18));
            alert(`ticket sucessfully bought txhash: ${transactionHash}`);
            setLoading(false);
            setReload(reload => !reload);
        } catch (e){
            setLoading(false);
            setReload(reload => !reload);
        }
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
