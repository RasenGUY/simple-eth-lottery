import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export const BuyTicket = ({setLoading, disabled}) => {

    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm();
    
    const onSubmit = async data => {console.log(data)}
    
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
