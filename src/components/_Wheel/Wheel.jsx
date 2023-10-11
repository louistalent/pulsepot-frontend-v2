import './wheel.css';

import React, { useEffect, useRef, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import Checkbox from 'react-custom-checkbox';
import Button from 'react-bootstrap/Button';

import MakeBet from './MakeBet/MakeBet';

require('dotenv').config();



export default function Wheel() {
    const [betData, setBetData] = useState([
        {
            color: 'black',
            text: '1',
            type: 'Number',
            value1: 35.12,
            value2: 0.05,
            x: 36
        },
        {
            color: 'black',
            text: '1',
            type: 'Number',
            value1: 35.12,
            value2: 0.05,
            x: 36
        },
        {
            color: 'black',
            text: '1',
            type: 'Number',
            value1: 35.12,
            value2: 0.05,
            x: 36
        },
        {
            color: 'black',
            text: '1',
            type: 'Number',
            value1: 35.12,
            value2: 0.05,
            x: 36
        },
        {
            color: 'black',
            text: '1',
            type: 'Number',
            value1: 35.12,
            value2: 0.05,
            x: 36
        },
    ])
    return (
        <Box className="wheel_container">
            <Box className="circle-container">
                <Box className='circle-img' style={{ margin: 'auto' }}>

                </Box>
            </Box>
            <Box className="bet-container">
                <MakeBet betData={betData} />
            </Box>
        </Box>
    );
}
