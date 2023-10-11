

import React from 'react';
import './fortunewheel.css'
import fortunewheel from '../../assets/images/wheel-bg.png'

export default function FortuneWheel(props) {
    return (
        <div className='card FortuneWheel Page ComingSoonPage' style={{
            backgroundImage: `url(${fortunewheel})`
        }}>
            <div className='page_title'>
                Fortune Wheel
            </div>

            <div className='Page-coming-soon orange '>
                Coming soon...
            </div>
        </div>
    )
}

