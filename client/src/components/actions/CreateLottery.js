import React from 'react'; 
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useBlockTime } from '../../hooks';
import { callContract } from '../../helpers'; 
const utils = require('web3').utils
const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;

export const CreateLottery = ({setLoading, lottery}) => {
    const { 
        register, 
        handleSubmit, 
        getValues,
        watch
    } = useForm();

    const watchDeadline = watch('deadline', 0); 
    const blockTime = useBlockTime(watchDeadline);
    const fields = watch();
    
    const onSubmit = async (d) => {
        /// extracting information from d does not seem to work consistently
        const {deadline, ticketPrice, maxTickets, maxUserTickets} = getValues();
        setLoading(true);
        const blocksDeadline = Math.round((Number(deadline) * 60) / blockTime);
        const ethPrice = await utils.toWei(String(ticketPrice), 'ether')
        const args = [blocksDeadline, ethPrice , Number(maxTickets), Number(maxUserTickets)];
        const data = lottery.methods.newLottery(...args).encodeABI();
        try { 
            const { transactionHash } = await callContract(lotteryAddress, data);
            alert(`Created New Lottery txhash: ${transactionHash}`);
            window.location.reload();
            setLoading(false);
        } catch (e){
            window.location.reload();
            setLoading(false);
        }
    }
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
                    <FormControl type="number" aria-label={'TicketPrice'} placeholder="TicketPrice in ether" step={0.01} {...register('ticketPrice')}></FormControl>
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
                <Button 
                variant="info" 
                type="submit" 
                style={{width: "inherit"}} 
                disabled={
                    (Object.values(fields).filter(field => field !== "").length !== 4) ? true : false} 
                >Create Lottery</Button> 
            </Form.Group>
        </Form>
    )
}
