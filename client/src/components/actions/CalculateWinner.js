import React from 'react';
import {Form, Button} from 'react-bootstrap';
import { useForm } from 'react-hook-form';


export const CalculateWinner = ({setLoading}) => {
    
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
                <h2>Calculate Winner</h2>
            </Form.Group>
            <Form.Group className="mt-3" style={{width: "100%"}}>
                <Button variant="info" type="submit" style={{width: "inherit"}}>Calculate Winner</Button> 
            </Form.Group>
        </Form>
    )
}
