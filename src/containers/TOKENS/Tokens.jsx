import React from 'react'
import './tokens.css'
import SingleTokenWhitelist from '../../components/singleTokenWhitelist1/SingleTokenWhitelist'
export default function Tokens(props) {
    return (
        <div className='card Tokens Page ComingSoonPage'>

            <div className='page_title  underline-yellow'>
                Accepted Tokens
            </div>
            <div className='page_content tokens-whitelist'>
                {(props.tokens).map((token, index) => {
                    return (
                        <SingleTokenWhitelist token={token.name} tokens={props.tokens} key={index} />
                    )
                })}
            </div>
        </div>
    )
}
