

import React, { useEffect, useRef, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import Checkbox from 'react-custom-checkbox';
import Button from 'react-bootstrap/Button';

import "./BetRow.css";

const BetRow = ({ item }) => {
    useEffect(() => {
        console.log('item : ');
        console.log(item);
    }, [])

    return (
        <Box className="bet-row-container">
            <Box className='' style={{ flex: 2 }}>
                <Box className='color-bg' style={{ background: `${item.color}` }}>
                    <Box className='' style={{ textAlign: 'center' }}>
                        {item.text}
                    </Box>
                </Box>
                <Box>{item.type}</Box>
            </Box>

            <Box className='edit-value ' style={{ flex: 2 }}>
                ${item.value1} / {item.value2}
            </Box>
            <Box className=' ' style={{ flex: 1 }}>
                <Box className=''>
                    <img src="/assets/buy/bnb.png" style={{ width: '20px', height: '20px' }} alt="" />
                </Box>
                {
                    item.x
                }
            </Box>
        </Box>
    )
}

export default BetRow;