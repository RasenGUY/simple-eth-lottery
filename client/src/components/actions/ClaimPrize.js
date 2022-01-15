import React from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';


export const ClaimPrize = ({setLoading}) => {
    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm();

    const onSubmit = async (data) => {console.log(data)}

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="flex-fill mt-3" style={{margin: "0 auto 0 auto"}}>
            <Form.Group className="text-center">
                <h2>Claim Prize</h2>
            </Form.Group>
            <Form.Group className="d-flex flex-column justify-content-between" style={{width: "100%"}}>
                <InputGroup className="">
                    <InputGroup.Text>Address Winner</InputGroup.Text>
                    <FormControl type="text" aria-label={'address Winner'} placeholder="address of winner" {...register('addressWinner')}></FormControl>
                </InputGroup>
            </Form.Group>
            <Form.Group className="mt-3" style={{width: "100%"}}>
                <Button variant="info" type="submit" style={{width: "inherit"}}>Claim</Button> 
            </Form.Group>
        </Form>
    )
}
