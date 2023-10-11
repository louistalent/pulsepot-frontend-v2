import './singlePE.css'
import React from 'react';
import Web3 from 'web3';
import Blocky from '../blocky/Blocky';
import TokenImage from '../../components/TokenImage';
export default function SinglePE(props) {
    if (!props.entry) {
        return (<div>Loading</div>)
    }
    return (
        <div className={props.animate !== undefined ? props.animate + " singlepe" : "singlepe"}>
            <span>
                <Blocky address={(props.entry.address).toLowerCase().toString()} size={""} />
                <Blocky address={props.entry.address.toLowerCase().toString()} scale_={16} size_={1} bgColor_={props.entry.address.toLowerCase().toString()} spotColor_={props.entry.address.toLowerCase().toString()} className_={"round-identicon"} />
            </span>
            <span>{(props.entry.address).toString().substring(0, 5) + "..." + (props.entry.address).toString().slice(-5)}
            </span>
            <span className='singlepe-price  bold-7'>${(props.entry.usdvalue / 10000000000).toFixed(2)}
            </span>
            <span className='singlepe-amount'>{parseFloat(parseFloat(Web3.utils.fromWei('' + props.entry.value, "ether")).toFixed(5))}</span>
            <TokenImage token={props.entry.token.toString()} class_name={'single-pe__tokenimage'} />
        </div>
    );
}
