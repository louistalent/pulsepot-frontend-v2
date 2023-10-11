

import React from 'react';
import './roulette.css'
import roulette from '../../assets/images/roulette-bg.png'
import Wheel from '../../components/_Wheel/Wheel';
import Box from '@material-ui/core/Box';

export default function Roulette(props) {

    return (
        // <div className='card Roulette_ Page ComingSoonPage' style={{
        //     backgroundImage: `url(${roulette})`
        // }}>
        <Box>
            <Wheel />
            <img src='/assets/roulette/temp.png' />
        </Box>
        // </div>
    )
}

