import React, { useEffect, useState } from 'react';
import './enter.css';
import './potAI.css';
import TokenImage from '../TokenImage';
import down_arrow from '../../assets/images/down-arrow.png';
import copy from '../../assets/images/copy.png';
import loading from '../../assets/images/loading.svg';
import qrcode from '../../assets/images/qrcode.png';
import Erc20Abi from '../../abis/erc20.json';
import TokenSelection from '../tokenSelection/TokenSelection';
import TokenSymbol from '../TokenSymbol';

require('dotenv').config();

const REACT_APP_NATIVE_TOKEN = process.env.REACT_APP_NATIVE_TOKEN;
export default function Enter(props) {
    const [enterState, setEnterState] = useState({
        showWalletConnect: true,
        selectedToken: "BNBP",
        amount: '',
        tokenAddress: "0x4D9927a8Dc4432B93445dA94E4084D292438931F",
        userTokenBalance: {},
        tokenPrice: 0,
        showTokenSelection: false,
        'BNBP_Price:': 1,
        awaitingApproval: false,
    });

    async function EnterPot(amount, name, transactionHash) {
        if (transactionHash) {
            const receipt = await window.__web3.eth.getTransactionReceipt(transactionHash);
            if (!receipt) {
                setTimeout(() => EnterPot(amount, name, transactionHash), 1000);
            } else {
                EnterPot(amount, name);
            }
        } else {
            window.__web3.eth.getGasPrice(function (error, gasPrice) {
                const transactionParameters1 = {
                    from: props.account,
                    to: props.potAddress,
                    data: window.PotContract.methods
                        .enterPot(name, window.__web3.utils.toWei(amount + '', 'ether'), props.account)
                        .encodeABI(),
                    chainId: window.__web3.utils.toHex(56),
                    gas: window.__web3.utils.toHex('800000'),
                    gasPrice: window.__web3.utils.toHex(parseInt(gasPrice)),
                };

                setEnterState((preState) => ({
                    ...preState,
                    awaitingApproval: false,
                }));
                window.___provider
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters1],
                    })
                    .then((txHash) => {
                        console.log('This is the transaction hash for enterpot', txHash);
                    })
                    .catch((error) => {
                        console.error('There was an error: ', error);
                    });
            });
        }
    }

    function approve(amount, name, address) {
        if (!window.__web3.utils.isAddress(address)) {
            alert('Not an EVM address');
            return;
        }
        if (
            parseFloat(
                (enterState.amount *
                    props.tokens
                        .filter((token) => {
                            return token.name === enterState.selectedToken;
                        })
                        .map((token) => {
                            return token.price;
                        })[0]) /
                10000000000
            ).toFixed(2) < 5
        ) {
            alert('Minimum entrance is 5 USD');
            return;
        }
        console.log('inside the approve function');
        if (isNaN(amount) || 0 >= amount) {
            alert('please enter a valid token amount');
            return;
        }
        if (name === REACT_APP_NATIVE_TOKEN) {
            window.__web3.eth.getGasPrice(function (error, gasPrice) {
                const transactionParameters = {
                    from: props.account,
                    to: props.potAddress,
                    value: window.__web3.utils.toHex(window.__web3.utils.toWei(parseFloat(amount) + '', 'ether')),
                    chainId: window.__web3.utils.toHex(56),
                    gas: window.__web3.utils.toHex('800000'),
                    gasPrice: window.__web3.utils.toHex(parseInt(gasPrice)),
                };
                window.___provider
                    .request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    })
                    .then((txHash) => { })
                    .catch((error) => { });
            });
        } else {
            let contract = new window.__web3.eth.Contract(Erc20Abi, address);
            console.log("Contract: ", contract)
            // console.log(Erc20Abi, " : ", props.potAddress)
            // console.log(props.account, " : ", props.potAddress, " | ", address)
            contract.methods
                .allowance(props.account, props.potAddress)
                .call()
                .then((allowance, error) => {
                    console.log(
                        'This is the allowance: ',
                        parseFloat(window.__web3.utils.fromWei(allowance + '', 'ether')),
                        ' and this is the amount: ',
                        amount
                    );
                    if (parseFloat(amount) <= parseFloat(window.__web3.utils.fromWei(allowance + '', 'ether'))) {
                        EnterPot(amount, name);
                    } else {
                        const transactionParameters = {
                            from: props.account,
                            to: address,
                            data: contract.methods
                                .approve(props.potAddress, window.__web3.utils.toWei(amount + '', 'ether'))
                                .encodeABI(),
                            chainId: window.__web3.utils.toHex(56),
                        };

                        window.___provider
                            .request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })
                            .then((txHash) => {
                                setEnterState((preState) => ({
                                    ...preState,
                                    awaitingApproval: true,
                                }));
                                console.log('This is the transaction hash for token approval', txHash);
                                // setTimeout(() => {
                                EnterPot(amount, name, txHash);
                                // }, 8000);
                            })
                            .catch((error) => {
                                console.error('There was an error approving token: ', error);
                            });
                    }
                }).catch(error => {

                    console.log(" Error: ", error)
                });
        }
    }

    async function getBalance(name, address) {
        // console.log("Name: ", name, " Address: ", address)
        if (!window.__web3.utils.isAddress(props.account)) {
            setEnterState((preState) => ({
                ...preState,
                userTokenBalance: {
                    ...preState.userTokenBalance,
                    [name]: 0,
                },
            }));
            return;
        }
        try {
            if (name === REACT_APP_NATIVE_TOKEN) {
                const balance = await window.__web3.eth.getBalance(props.account);
                // console.log("Token: ", name, " Balance: ", balance)
                setEnterState((preState) => ({
                    ...preState,
                    userTokenBalance: {
                        ...preState.userTokenBalance,
                        [name]: window.__web3.utils.fromWei(balance, 'ether'),
                    },
                }));
                return window.__web3.utils.fromWei(balance, 'ether');
            } else {
                let contract = new window.__web3.eth.Contract(Erc20Abi, address);
                const balance = await contract.methods.balanceOf(props.account).call();
                // console.log("Token: ", name, " Balance: ", balance)
                setEnterState((preState) => ({
                    ...preState,
                    userTokenBalance: {
                        ...preState.userTokenBalance,
                        [name]: window.__web3.utils.fromWei(balance, 'ether'),
                    },
                }));
                return window.__web3.utils.fromWei(balance, 'ether');
            }
        } catch (error) {
            setEnterState((preState) => ({
                ...preState,
                userTokenBalance: {
                    ...preState.userTokenBalance,
                    [name]: 0,
                },
            }));
            return 0;
        }
    }

    async function setTokenMax(name, address) {
        if (!window.__web3.utils.isAddress(address)) {
            return;
        }
        const balance = await getBalance(name, address);
        setEnterState((preState) => ({
            ...preState,
            amount: balance,
        }));
    }

    useEffect(() => {
        const getPrice = async () => {
            try {
                let data;
                const response = await fetch(
                    'https://api.dexscreener.com/latest/dex/tokens/' + '0x4D9927a8Dc4432B93445dA94E4084D292438931F'
                );
                data = await response.json();
                // console.log('This is the BNBP Info: ', data.data.price);
                setEnterState((preState) => ({
                    ...preState,
                    BNBP_Price: data.pairs[0].priceUsd,
                }));
            } catch (error) {
                console.log('Failed to fetch: ', error);
            }
        };
        getPrice();
        if (props.account) props.tokens.map((element) => getBalance(element.name, element.address));
    }, [props.tokens, props.account]);

    return (
        <div className="tokenSelectionContainer">
            <div className={props.showToken ? 'show_tokenSelection show card' : 'none'}>
                <TokenSelection
                    BNBPPrice={enterState.BNBP_Price}
                    tokens={enterState.userTokenBalance}
                    _tokens={props.tokens}
                    setEnterState={setEnterState}
                    setShowToken={props.setShowToken}
                />
            </div>
            <div className="Enter card">
                <div className="Enter_header hover">
                    <div
                        onClick={() => {
                            setEnterState(preState => ({
                                ...preState,
                                "showWalletConnect": true
                            }))
                        }}
                        className={enterState.showWalletConnect ? 'Enter_selected' : 'Enter_not_selected'}
                    >
                        Wallet Connect
                    </div>
                    <div
                        onClick={() => {
                            setEnterState(preState => ({
                                ...preState,
                                "showWalletConnect": false
                            }))
                        }}
                        className={!enterState.showWalletConnect ? 'Enter_selected' : 'Enter_not_selected'}
                    >
                        Manual Transaction
                    </div>
                </div>
                {enterState.showWalletConnect ? (
                    <div className="Enter_transaction" onClick={() => {
                        if (!window.__web3.utils.isAddress(props.account)) {
                            props.connectWallet()
                        }
                    }}>
                        <div className="Enter_transaction_">
                            <div className="Enter_transaction_amount">
                                <input
                                    className="bold-7"
                                    type={'text'}
                                    placeholder="0.0"
                                    id={'tokenAmount'}
                                    value={enterState.amount}
                                    onChange={(e) => {
                                        if (!isNaN(e.target.value)) {
                                            setEnterState((prevState) => ({ ...prevState, amount: e.target.value }));
                                        }
                                    }}
                                ></input>
                                <div>
                                    {parseFloat(
                                        (enterState.amount *
                                            props.tokens
                                                .filter((token) => {
                                                    return token.name === enterState.selectedToken;
                                                })
                                                .map((token) => {
                                                    return token.price;
                                                })[0]) /
                                        10000000000
                                    ).toFixed(2)}{' '}
                                    USD
                                </div>
                            </div>
                            <div className="Enter_transaction_select">
                                <span
                                    className="hover"
                                    onClick={(e) => {
                                        setTokenMax(enterState.selectedToken, enterState.tokenAddress);
                                        e.target.style.background = '#f3ba2c';
                                        e.target.style.color = '#2d2e36';
                                        setTimeout(() => {
                                            e.target.style.background = '#2d2e36';
                                            e.target.style.color = '#f3ba2c';
                                        }, 1500);
                                    }}
                                >
                                    max
                                </span>
                                <div
                                    className="Enter_transaction_select_token  hover"
                                    onClick={(e) => {
                                        if (!window.__web3.utils.isAddress(props.account)) {
                                            props.connectWallet()
                                            return
                                        }
                                        props.setShowToken(!props.showToken);
                                        e.stopPropagation();
                                    }}
                                >
                                    <TokenImage token={enterState.selectedToken} class_name={'Enter_transaction_select_token_img'} />
                                    <div>
                                        <TokenSymbol name={enterState.selectedToken} />
                                    </div>
                                    <img src={down_arrow} alt={'downarrow'} />
                                </div>
                                <div className="Enter_transaction_token_balance">
                                    Balance:{' '}
                                    {enterState.userTokenBalance[enterState.selectedToken]
                                        ? parseFloat(enterState.userTokenBalance[enterState.selectedToken]).toFixed(5)
                                        : 0}
                                </div>
                            </div>
                        </div>
                        {props.account.length > 0 ? (
                            <div
                                className="Enter_connect Enter_SendtoPot"
                                onClick={() => {
                                    approve(enterState.amount, enterState.selectedToken, enterState.tokenAddress);
                                }}
                            >
                                {enterState.awaitingApproval ? (
                                    <div>
                                        Awaiting approval... <img src={loading} alt="loading svg" />
                                    </div>
                                ) : (
                                    <div>Send to Pot</div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="Enter_connect Enter_connectWallet"
                                onClick={() => {
                                    props.connectWallet();
                                }}
                            >
                                Confirm & Spin
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="potcontract-addinfo">
                        <div className="potcontract-addinfo_qrcode">
                            <img src={qrcode} alt="qrcode icon" />
                        </div>
                        <div className="potcontract-addinfo_address">
                            <div className="potcontract-addinfo_address__">
                                <div>Send tokens to contract: </div>
                            </div>

                            <div className="potcontract-addinfo_address--copyimg">
                                <span className="potcontract-addinfo_address--copy">{props.potAddress.toString()} </span>
                                <div
                                    className="potcontract-addinfo_address--img"
                                    onClick={(e) => {
                                        window.navigator.clipboard.writeText(props.potAddress.toString());
                                        e.target.parentElement.style.background = '#edf8d8';
                                        setTimeout(() => {
                                            e.target.parentElement.style.background = '';
                                        }, 200);
                                    }}
                                >
                                    <img src={copy} alt="copy icon" />
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
