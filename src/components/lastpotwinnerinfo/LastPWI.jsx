import './lastPWI.css'
import React from 'react';
import trophy from '../../assets/images/trophy.png'
import plsp from "../../assets/images/bnbp-blue.png"
import plsp_ from "../../assets/images/bnbp-icon.png"
import fee from "../../assets/images/fee.png"
import burn from "../../assets/images/burn.png"
require('dotenv').config()

// const REACT_APP_NATIVE_TOKEN = process.env.REACT_APP_NATIVE_TOKEN
const REACT_APP_PLSP_SYMBOL = process.env.REACT_APP_PLSP_SYMBOL
export default function LastPWI(props) {
    let ratio = 1//0.006
    return (
        props.winner ?
            <div className='lastpwi'>
                <div className='lastpwi-info'>
                    <div className='lastpwi-info__crown'>
                        <span style={{ textAlign: "left" }}>< img src={burn} style={{ "width": "10px" }} alt='burn icon' />{((((props.winner.value - props.winner.amountwon) * 0.05) / (props.BNBPPrice * 10 ** 10) * ratio).toFixed(4))}
                            < img src={plsp_} style={{ "width": "10px" }} alt='plsp icon' />
                            {REACT_APP_PLSP_SYMBOL}</span>
                        < img src={trophy} alt='trophy icon' />
                        <span style={{ "paddingRight": "5px", textAlign: "right" }}>< img src={plsp} style={{ "width": "10px" }} alt='plsp icon' />{(parseFloat((1 + parseFloat(props.winner.value) / (1.5 * (10 ** 12))).toFixed(1)) < 20 ? parseFloat((1 + parseFloat(props.winner.value) / (1.5 * (10 ** 12))).toFixed(1)) : 20)} {REACT_APP_PLSP_SYMBOL}</span>
                    </div>
                    <div className='lastpwi-info__congrat'>Congratulations <span>{(props.winner.winner).toString().substring(0, 5) + "..." + (props.winner.winner).toString().slice(-5)}</span></div>
                    <div className='lastpwi-info__won'>Won ${((props.winner.amountwon) / 10000000000).toFixed(1)} with {(((props.winner.amount) / (props.winner.value)) * 100).toFixed(1)}% chance</div>
                    <div className='lastpwi-info__txlink'><a href={"https://bscscan.com/tx/" + props.winner.txHash} target={"_blank"}> Transaction link</a></div>
                    <div className='lastpwi-info__percentage_fee tooltip__ hover' style={{ fontSize: "12px" }}>
                        <div>
                            <span className="tooltiptext">${((props.winner.value - props.winner.amountwon) / 10000000000).toFixed(1)} accumulated as fees</span>
                            {(((props.winner.value - props.winner.amountwon) * 100) / props.winner.value).toFixed(2)}%
                            <img src={fee} style={{ "width": "11px" }} alt='plsp icon' />
                        </div>
                    </div>
                </div>
            </div > :
            <div className='lastpwi'>
                <div className='lastpwi-info'>
                    <div className='lastpwi-info__crown'>
                        <img src={trophy} alt='trophy icon' />
                    </div>
                    <div className='lastpwi-info__congrat'>Unable to get lalest winner <span>0x000...00000</span></div>
                    <div className='lastpwi-info__won'>Unable to get latest winner</div>
                    <div className='lastpwi-info__txlink'><a href="/#"> Transaction link</a></div>
                </div>
            </div >
    );
}
