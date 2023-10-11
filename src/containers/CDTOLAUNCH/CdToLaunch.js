
import { Link } from "react-router-dom";
import React from 'react'
import './cdToLaunch.css'
import faucet from '../../assets/images/faucet-active.png'
import swap from '../../assets/images/swap.png'
import staking from '../../assets/images/staking.png'
import add from '../../assets/images/add.png'
import chart from '../../assets/images/chart.png'
import explorer from '../../assets/images/explorer.png'
import logo from '../../assets/images/bnbp-icon.png'
import copyyellow from '../../assets/images/copy.png'
import arrow_right from '../../assets/images/arrow-right.png'
import CountdownTimer from "react-component-countdown-timer";
require('dotenv').config();
const plsp_contract_address = process.env.REACT_APP_BNBP_CONTRACT_ADDRESS;
const REACT_APP_PLSP = process.env.REACT_APP_PLSP;

export default function CdToLaunch() {
    return (
        <div className='card CDLaunch Page'>
            <div className='Page-subtle-content cdlaunch-content'>
                <div className='cdlaunch-c1 mobile_none'>
                    <div className='hover white'>
                        <Link to="/faucet">
                            <img src={faucet} alt='arrow icon' /> BNBFaucet
                        </Link>
                    </div>
                    <div className='hover white'>
                        <Link to="/swap">
                            <img src={swap} alt='arrow icon' /> Swap
                        </Link>
                    </div>
                    <div className='hover white'>
                        <Link to="/stake">
                            <img src={staking} alt='arrow icon' /> Staking
                        </Link>
                    </div>
                </div>
                <div className='cdlaunch-c2'>
                    <div className='cdlaunch-c2-1 mobile_none'>
                        Games & Participation phase
                    </div>
                    <div className='cdlaunch-c2-1 desktop_none'>
                        Participation phase
                    </div>
                    <div className='cdlaunch-c2-2'>
                        Starting soon...
                    </div>
                    <div className='cdlaunch-c2-3'>
                        <CountdownTimer count={(1664582400 + (86400 * 18)) - parseInt(Date.now() / 1000)} onEnd={() => {
                        }} />
                    </div>
                    <div className='cdlaunch-c2-faucet hover mobile_none' onClick={() => {
                        window.navigator.clipboard.writeText("0x4D9927a8Dc4432B93445dA94E4084D292438931F")
                    }}>
                        <img src={logo} alt='arrow icon' /><span className="white"> BNBP </span> 0x4D9927a8Dc4432B93445dA94E4084D292438931F <img src={copyyellow} alt='arrow icon' />
                    </div>
                </div>
                <div className='cdlaunch-c1 desktop_none'>
                    <div className='hover white'>
                        <Link to="/swap">
                            Swap
                        </Link>
                    </div>
                    <div className='hover white'>
                        <Link to="/stake">
                            Staking
                        </Link>
                    </div>
                </div>
                <div className='cdlaunch-c2-faucet hover desktop_none' style={{ background: "#454753" }} onClick={() => {
                    window.navigator.clipboard.writeText("0x4D9927a8Dc4432B93445dA94E4084D292438931F")
                }}>
                    <img src={logo} alt='arrow icon' /><span className="white"> BNBP </span> {("0x4D9927a8Dc4432B93445dA94E4084D292438931F").substring(0, 7) + "..." + ("0x4D9927a8Dc4432B93445dA94E4084D292438931F").slice(-7)} <img src={copyyellow} alt='arrow icon' />
                </div>
                <div className='cdlaunch-c1 desktop_none'>
                    <div className='hover' onClick={() => {
                        try {
                            const wasAdded = window.___provider.request({
                                method: 'wallet_watchAsset',
                                params: {
                                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                                    options: {
                                        address: "0x4D9927a8Dc4432B93445dA94E4084D292438931F", // The address that the token is at.
                                        symbol: "BNBP", // A ticker symbol or shorthand, up to 5 chars.
                                        decimals: 18, // The number of decimals in the token
                                        image: 'https://bnbpot.io/bnbp-icon.png',
                                    },
                                },
                            });

                            if (wasAdded) {
                                console.log('Thanks for your interest!');
                            } else {
                                console.log('Your loss!');
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }} >
                        <Link to="" style={{ background: "#454753" }} >
                            Add to metamask
                        </Link>
                    </div>
                    <div className='hover'>
                        <Link to="/faucet" style={{ background: "#454753" }}>
                            BNB Faucet
                        </Link>
                    </div>
                </div>
                <Link to="/pphase" className='cdlaunch-c1_mobile_pphase desktop_none hover white'>
                    About Participation Phase
                    <img src={arrow_right} alt='arrow icon' />
                </Link>
                <div className='cdlaunch-c1 desktop_none'>
                    <div className='hover' >
                        <a href="https://dexscreener.com/bsc/0x4c736d24d72d874cc2465553500c1ff3fc7b3bda" target="_blank" style={{ background: "#454753" }}>
                            Chart
                        </a>
                    </div>
                    <div className='hover'>
                        <a href="https://bscscan.com/token/0x4D9927a8Dc4432B93445dA94E4084D292438931F" target="_blank" style={{ background: "#454753" }}>
                            Explorer
                        </a>
                    </div>
                </div>





                <div className='cdlaunch-c1 mobile_none'>
                    <div className='hover' onClick={() => {
                        try {
                            const wasAdded = window.___provider.request({
                                method: 'wallet_watchAsset',
                                params: {
                                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                                    options: {
                                        address: "0x4D9927a8Dc4432B93445dA94E4084D292438931F", // The address that the token is at.
                                        symbol: "BNBP", // A ticker symbol or shorthand, up to 5 chars.
                                        decimals: 18, // The number of decimals in the token
                                        image: 'https://bnbpot.io/bnbp-icon.png',
                                    },
                                },
                            });

                            if (wasAdded) {
                                console.log('Thanks for your interest!');
                            } else {
                                console.log('Your loss!');
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }}>
                        <Link to="">
                            <img src={add} alt='arrow icon' /> Add to Metamask
                        </Link>
                    </div>
                    <div className='hover'>
                        <a target="_blank" href="https://dexscreener.com/bsc/0x4c736d24d72d874cc2465553500c1ff3fc7b3bda">
                            <img src={chart} alt='arrow icon' /> Chart
                        </a>
                    </div>
                    <div className='hover'>
                        <a target="_blank" href="https://bscscan.com/token/0x4D9927a8Dc4432B93445dA94E4084D292438931F">
                            <img src={explorer} alt='arrow icon' /> Explorer
                        </a>
                    </div>

                </div>
            </div>
        </div >
    )
}
