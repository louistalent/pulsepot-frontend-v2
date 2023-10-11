

import React, { useEffect, useRef, useState } from 'react';

import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import Checkbox from 'react-custom-checkbox';
import Button from 'react-bootstrap/Button';
import './MakeBet.css'

import BetRow from '../BetRow/BetRow';
export default function MakeBet({ betData }) {

    return (
        <Box className="makebet-container">
            <Box className='' style={{ fontSize: '20px', color: 'grey', textAlign: 'center' }}> Make your bet</Box>
            <Box className='makebet-body'>
                <Box className='justify'>
                    <Box className='flex2' style={{ color: 'white' }}>Your bet</Box>
                    <Box className='flex2'>Edit value</Box>
                    <Box className='flex1'>MultiPlier</Box>
                </Box>
                {
                    betData.map((item, index) => (
                        <BetRow item={item} />
                    ))
                }
            </Box>
        </Box>
    );
}



