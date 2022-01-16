import React from 'react';
import {Form, Button} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { callContract } from '../../helpers'; 
const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;


export const CalculateWinner = ({setLoading, lottery}) => {
    
    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm();
    
    const onSubmit = async d => {
        setLoading(true);
        const data = lottery.methods.calculateWinner().encodeABI();
        const receipt = await callContract(lotteryAddress, data);
        console.log(receipt);
        // alert(`winner calculated: ${receipt}`);
        setLoading(false);
    }
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="mt-3"    >
            <Form.Group className="text-center">
                <h2>Calculate Winner</h2>
            </Form.Group>
            <Form.Group className="mt-3" style={{width: "100%"}}>
                <Button variant="info" type="submit" style={{width: "inherit"}}>Calculate Winner</Button> 
            </Form.Group>
        </Form>
    )
}
