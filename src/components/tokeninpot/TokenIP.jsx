import './tokenIP.css'
import React from 'react';
import TokenImage from '../../components/TokenImage';
import TokenSymbol from '../TokenSymbol';
var BigInt = require("big-integer");

export default function TokenIP(props) {
    return (
        <div className='token-inpot card border-5'>
            {/* tokenName={tokens.tokenName} amount={tokens.amount} usdValue={tokens.usdValue}  */}
            <TokenImage token={props.name} class_name={''} />
            <span className='token-inpot__name'><TokenSymbol name={props.name} /></span>
            <span className='token-inpot__amount'>{parseFloat(parseFloat(window.__web3.utils.fromWei(BigInt(props.value).toString(), "ether")).toFixed(5))}</span>
            <span className='token-inpot__usdtvalue'>${parseFloat((props.usdvalue / (10 ** 10)).toFixed(2))}</span>
            {/* <span>{props.price}</span> */}

        </div>
    );
}
