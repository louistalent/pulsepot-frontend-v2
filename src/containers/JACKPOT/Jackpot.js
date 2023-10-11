

import React from 'react';
import './jackpot.css'
import jackpot from '../../assets/images/jackpot-bg.png'

export default function PriceCalls(props) {

    return (
        <div className='card Jackpot Page ComingSoonPage' style={{
            backgroundImage: `url(${jackpot})`
        }}>
            <div className='page_title'>
                JackPot
            </div>

            <div className='Page-coming-soon orange '>
                Coming soon...
            </div>
        </div>
    )
}

