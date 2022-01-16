import React from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useToClaim } from '../../hooks';
import { callContract } from '../../helpers';
const lotteryAddress = process.env.REACT_APP_GAMELOTTERY_ADDRESS;

export const ClaimPrize = ({setLoading, winner, lottery}) => {
    const toClaim = useToClaim(winner);
    const { 
        register, 
        handleSubmit
    } = useForm({
        defaultValues: { winnerAddress: winner.toLowerCase()}
    });

    const onSubmit = async ({winnerAddress}) => {
        setLoading(true);
        const data = lottery.methods.withdrawPayments(winnerAddress).encodeABI();
        const { transactionHash } = await callContract(lotteryAddress, data);
        alert(`sucessfully claimed ${toClaim} ETH txhash: ${transactionHash}`);
        setLoading(false);
        window.location.reload();
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="flex-fill mt-3" style={{margin: "0 auto 0 auto"}}>
            <Form.Group className="text-center">
                <h2>Claim Prize</h2>
            </Form.Group>
            <Form.Group className="d-flex flex-column justify-content-between" style={{width: "100%"}}>
                <InputGroup className="">
                    <InputGroup.Text>Winner Address</InputGroup.Text>
                    <FormControl 
                    type="text"
                    value={winner.toLowerCase()}
                    aria-label={'Winner Address'} 
                    placeholder="winner address" 
                    {...register('winnerAddress')} disabled></FormControl>
                </InputGroup>
            </Form.Group>
            <Form.Group className="mt-3" style={{width: "100%"}}>
                <Button variant="info" type="submit" style={{width: "inherit"}} disabled={toClaim < 0.01 ? true : false}>Claim {!toClaim ? "...calulating" : String(toClaim) + " ETH"} </Button> 
            </Form.Group>
        </Form>
    )
}
