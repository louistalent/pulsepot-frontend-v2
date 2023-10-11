

import React from 'react';
import './sports.css'
import sports from '../../assets/images/sports-bg.png'

export default function Sports(props) {

    return (
        <div className='card Sports Page ComingSoonPage' style={{
            backgroundImage: `url(${sports})`
        }}>
            <div className='page_title'>
                Sports
            </div>

            <div className='Page-coming-soon orange '>
                Coming soon...
            </div>
        </div>
    )
}

