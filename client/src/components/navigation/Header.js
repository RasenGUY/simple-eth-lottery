import React, {useState, useCallback, useEffect} from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useAppContext } from '../../AppContext';
import { createWeb3Modal } from './createWeb3Modal';
import Web3 from 'web3';

const web3Modal = createWeb3Modal();

export const Header = () => {
    const { injectedProvider, setInjectedProvider } = useAppContext(); 
    const [connected, setConnected] = useState();
    const logout = async () => {
        await web3Modal.clearCachedProvider();
        if (injectedProvider && typeof injectedProvider.disconnect == "function") {
          await injectedProvider.disconnect();
        }
        setConnected(false);
        setInjectedProvider(undefined);
        setTimeout(() => {
            window.location.reload();
        }, 1);
    }

    
    const login = useCallback(async () => {
        var injected;
        try {
            
            let provider = await web3Modal.connect();
            injected = new Web3(provider).currentProvider;
            if(injected && Number(injected.chainId) !== 3) await handleWrongChain(injected); // if wrong chain then switch chains

            injected.on('connect', info => {
                console.log(info);
            });

            injected.on('accountsChanged', account => {
                setInjectedProvider(new Web3(window.ethereum).currentProvider);
                console.log("account changed");
            });

            injected.on('chainChanged', chainId => {
                console.log(`switched chains ${chainId}`);
                if(window.ethereum.chainId !== 3) handleWrongChain(window.ethereum, logout);
                setInjectedProvider(new Web3(window.ethereum).currentProvider);
            });
            setInjectedProvider(injected);
            setConnected(true);

        } catch (e){ 
            console.log(e);
        }

    }, [injectedProvider]);
    
    useEffect(()=>{
        if (web3Modal.cachedProvider) {
            login();
        }
        if(injectedProvider && Number(injectedProvider.chainId) !== 3) handleWrongChain(injectedProvider, setInjectedProvider, logout);
    }, [injectedProvider, login]);


    function handleWrongChain (provider, setProvider, logout){
        console.log(new Error("wrong chainId switch to rinkeby network"));
        provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x3' }],
        }).then(r => {
            setProvider(new Web3(window.ethereum).currentProvider);
            console.log("switched chains sucessfully"); 
        })
        .catch(e => {
            // setConnected(false);
            console.log(e);
            logout();
        });
    } 

    return (
        <Navbar fixed="top" bg="light" expand="lg">
            <Container fluid className="px-5">
                <Navbar.Brand href="/"><h1>GameLottery</h1></Navbar.Brand>
                {
                    !connected 
                    ? <div><Button variant="outline-success" onClick={login}>Connect Wallet</Button></div> 
                    : <div><Button variant="outline-success" onClick={logout}>Disconnect Wallet</Button></div>
                }
            </Container>
        </Navbar>
    )
}

