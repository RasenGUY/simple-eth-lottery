import React from 'react'; 
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export const CreateLottery = ({setLoading}) => {
    
    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm();

    const onSubmit = async (data) => {console.log(data)}
    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="flex-fill" style={{margin: "0 auto 0 auto"}}>
            <Form.Group className="text-center">
                <h2>Create New Lottery</h2>
            </Form.Group>
            <Form.Group className="d-flex flex-column justify-content-between" style={{width: "100%"}}>
                <InputGroup className="mt-3">
                    <InputGroup.Text>Deadline</InputGroup.Text>
                    <FormControl type="number" aria-label={'Deadline'} placeholder="Deadline in minutes" {...register('deadline')}></FormControl>
                </InputGroup>
                <InputGroup className="mt-3">
                    <InputGroup.Text>TicketPrice</InputGroup.Text>
                    <FormControl type="number" aria-label={'TicketPrice'} placeholder="TicketPrice in ether" {...register('ticketPrice')}></FormControl>
                </InputGroup>
                <InputGroup className="mt-3">
                    <InputGroup.Text>Max # Tickets</InputGroup.Text>
                    <FormControl type="number" aria-label={'Max # Tickets'} placeholder="Maximum # of tickets" {...register('maxTickets')}></FormControl>
                </InputGroup>
                <InputGroup className="mt-3">
                    <InputGroup.Text>Max # User Tickets</InputGroup.Text>
                    <FormControl type="number" aria-label={'Max # user tickets'} placeholder="Maximum # tickets per user" {...register('maxUserTickets')}></FormControl>
                </InputGroup>
            </Form.Group>
            <Form.Group className="mt-3" style={{width: "100%"}}>
                <Button variant="info" type="submit" style={{width: "inherit"}}>Create Lottery</Button> 
            </Form.Group>
        </Form>
    )
}
