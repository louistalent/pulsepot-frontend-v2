import './wheel.css';
import React, { useEffect, useRef, useState } from 'react';
import arrowhead from '../../assets/images/arrowhead-yellow.png';
import plsp from '../../assets/images/bnbp-blue.png';
import plsp_ from '../../assets/images/bnbp-icon.png';
import burn from '../../assets/images/burn.png';
const stc = require('string-to-color');
require('dotenv').config();

const REACT_APP_PLSP_SYMBOL = process.env.REACT_APP_PLSP_SYMBOL;
var timeidle_ = 0;
const beepAudio = new Audio('beep.mp3');
beepAudio.load();
const potTime = 180;

export default function Wheel(props) {
  const { PotInfo, isSpinning } = props;
  const [time, setTime] = useState(potTime);
  const [BNBPPrice, SetBNBPPrice] = useState(1);
  const potLiveTimeRef = useRef(0);
  const audioPlayingRef = useRef(false);
  const circleRadius = 150;
  let endIn = 0,
    start = 0;
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');

    return d;
  }
  function updatePotLiveTime() {
    if (PotInfo.participants.addresses.length > 1 && PotInfo.startTimer) {
      window.PotContract.methods
        .potLiveTime()
        .call()
        .then((potLiveTime) => {
          potLiveTimeRef.current = Number(potLiveTime);
        });
    }
  }

  useEffect(() => {
    setInterval(async () => {
      const timeLeft = 180 - (Math.floor(Date.now() / 1000) - potLiveTimeRef.current);

      if (timeLeft >= 0 && timeLeft <= 16) {
        if (!audioPlayingRef.current && window.localStorage.getItem('muted') != 'true') {
          try {
            beepAudio.click();
            await beepAudio.play();
            audioPlayingRef.current = true;
          } catch (error) {
            console.error(error);
            audioPlayingRef.current = false;
          }
        }
      } else {
        audioPlayingRef.current = false;
        beepAudio.pause();
      }
      if (timeLeft < 0) return;
      setTime(timeLeft < 0 ? 0 : timeLeft);
      if (timeLeft <= 0 && potLiveTimeRef.current != 0) {
        props.setPotInfo((prevState) => ({
          ...prevState,
          startTimer: false,
        }));
      }
    }, 1000);

    setInterval(() => {
      updatePotLiveTime();
    }, 3000);
  }, []);

  useEffect(() => {
    updatePotLiveTime();
  }, [PotInfo.participants.addresses]);

  useEffect(() => {
    const getPrice = async () => {
      try {
        let data;
        const response = await fetch(
          'https://api.dexscreener.com/latest/dex/tokens/' + '0x4D9927a8Dc4432B93445dA94E4084D292438931F',
          {}
        );
        data = await response.json();
        SetBNBPPrice(data.pairs[0].priceUsd);
      } catch (error) {
        console.log('Failed to fetch: ', error);
      }
    };
    getPrice();
  }, []);
  return (
    <div className="wheel_container">
      <div className="burn_bonus burn_bonus_burn">
        <div className={PotInfo.participants.addresses.length === 0 ? '' : ''}>
          {/* Pot will burn: */}
          <div className="card">
            <img src={burn} alt="fire logo" />
            {parseFloat((((0.03 * 0.05) * Number(PotInfo.currentRoundTotalUsd)) / (BNBPPrice * 10 ** 10)).toFixed(2))}
            <img src={plsp_} alt="fire logo" style={{ marginLeft: '5px' }} />
            {REACT_APP_PLSP_SYMBOL}
          </div>
        </div>
      </div>
      <div className="wheel">
        <div className="wheel_inner3 card" style={{ background: '#393b47' }}>
          <div className="wheelTimer">
            {parseInt(PotInfo.participants.addresses.length) > 1 ? (
              <div className="wheel-countdown">
                {time == 0 && !isSpinning && <div className="waitingFB">WAITING FOR BLOCK</div>}
                {Math.floor(time / 60)}:{(time % 60 < 10 ? '0' : '') + (time % 60)}
              </div>
            ) : (
              '3:00'
            )}
          </div>
          <div className="wheel_participant">
            {PotInfo.participants.addresses.length} Participant
            {PotInfo.participants.addresses.length > 1 ? 's' : ''}
          </div>
          <div className="wheelusdValue">${(PotInfo.currentRoundTotalUsd / 10 ** 10).toFixed(2)}</div>
          <div className="wheel__arrowhead">
            <img src={arrowhead} alt="arrowhead icon" />
          </div>
        </div>
        {PotInfo.participants.addresses.length > 0 ? (
          <svg
            height="350"
            width="350"
            className="spinwheel"
            id="wheel"
            style={{ animatiossnTimingFunction: 'ease-in !important', marginTop: '0px' }}
          >
            {PotInfo.participants.addresses.map((address, index, array) => {
              start = endIn;
              endIn = start + (PotInfo.participants.usdValue[index] * 359.8) / PotInfo.currentRoundTotalUsd;

              if (address === undefined) {
                return '';
              } else {
              }
              return (
                <path
                  data-start={start}
                  data-stop={endIn}
                  key={index}
                  id="arc1"
                  d={describeArc(175, 175, circleRadius, start, endIn)}
                  fill="none"
                  stroke={stc(address.toString().toLowerCase() + '')}
                  strokeWidth="40"
                />
              );
            })}
          </svg>
        ) : (
          <div className="wheel_inner1">
            <div className={props.isDarkMode ? 'wheel_inner2_dark' : 'wheel_inner2'}></div>
          </div>
        )}
      </div>
      <div className="burn_bonus burn_bonus_bonus">
        <div>
          {/* Bonus added: */}
          <div className="card">
            <img src={plsp} alt="plsp logo" />
            {PotInfo.entries.filter((entry) => entry.round === PotInfo.round).length === 0
              ? '1 ' + REACT_APP_PLSP_SYMBOL
              : (parseFloat(1 + parseFloat(PotInfo.currentRoundTotalUsd) / (1.5 * 10 ** 12)).toFixed(2) < 20
                ? parseFloat(1 + parseFloat(PotInfo.currentRoundTotalUsd) / (1.5 * 10 ** 12)).toFixed(2)
                : 20) +
              '  ' +
              REACT_APP_PLSP_SYMBOL}
          </div>
        </div>
      </div>
    </div>
  );
}
