import "./wheel.css"
import React, { useEffect, useState } from 'react';
import CountdownTimer from "react-component-countdown-timer";
import arrowhead from "../../assets/images/arrowhead-small.png"
import plsp from "../../assets/images/logo.png"
import burn from "../../assets/images/burn.png"
const stc = require("string-to-color");
require('dotenv').config()

const REACT_APP_PLSP_SYMBOL = process.env.REACT_APP_PLSP_SYMBOL

export default function Wheel(props) {
    const [time, setTime] = useState(1)
    // const [startTimer, setStartTimer] = useState(false)
    const circleRadius = 150
    let endIn = 0, start = 0
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");

        return d;
    }
    function _setTime() {
        /// console.log("CALLING _SETTIME")
        /// console.log(props.currentEntries)
        props.setPotInfo(prevState => {
            if (prevState.participants.addresses.length > 1) {
                console.log("[PARTICIPANTS ARE MORE THAN ONE ", prevState.participants)
                setTimeout(() => {
                    window.PotContract.methods.potLiveTime().call().then((potLiveTime) => {
                        let _time = parseInt(prevState.duration) - (parseInt(Math.floor(Date.now() / 1000)) - parseInt(potLiveTime))
                        _time = _time < 10 ? 5 : parseInt(_time)
                        // console.log("Time", _time, "potLive: ", parseInt(potLiveTime), "Current Time: ", parseInt(Math.floor(Date.now() / 1000)), "Duration: ", parseInt(prevState.duration))
                        setTime(_time)
                        props.setPotInfo(prevState => ({
                            ...prevState,
                            startTimer: true
                        }))
                    })
                }, 5);
            } else {
                console.log("[PARTICIPANTS ARE LESS THAN TWO ", prevState.participants)
            }
            return prevState
        })
    }

    useEffect(() => {
        // console.log("It has changed again: ", props.PotInfo.participants)
        _setTime()
    }, [props.PotInfo.currentEntries])
    return (
        <div className="wheel_container">
            <div className="burn_bonus">
                <div className={props.PotInfo.participants.addresses.length === 0 ? "none" : ""}>
                    Pot will burn:
                    <div className="card">
                        <img src={burn} alt='fire logo' />
                        {parseFloat((((parseFloat(3 / 500) * (parseFloat(props.PotInfo.currentRoundTotalUsd)).toFixed(2)) / parseFloat(props.APP_PLSP))).toFixed(5))} {REACT_APP_PLSP_SYMBOL}
                    </div>
                </div>
            </div>
            <div className="wheel">

                <div className="wheel_inner3 card">
                    <div className="wheelTimer">
                        {
                            props.PotInfo.startTimer ?
                                <div>
                                    {/* {parseInt(time) || 100} */}
                                    <CountdownTimer count={parseInt(time) || 100} border hideDay hideHours onEnd={() => {
                                        props.listenToCalculatewinner()
                                        // console.log("It is over");
                                    }} /></div>
                                :
                                "5:00"
                        }
                    </div>
                    <div className="wheel_participant">
                        {props.PotInfo.participants.addresses.length} Participant{props.PotInfo.participants.addresses.length > 1 ? "s" : ""}
                    </div>
                    <div className="wheelusdValue">
                        {(props.PotInfo.currentRoundTotalUsd / (10 ** 10)).toFixed(2)}$
                    </div>
                    <div className="wheel__arrowhead">
                        < img src={arrowhead} alt="arrowhead icon" />

                    </div >
                </div>
                {
                    props.PotInfo.currentEntries.length > 0 ?
                        <svg height="350" width="350" className="spinwheel" id="wheel" style={{ "animatiossnTimingFunction": "ease-in !important", marginTop: "0px" }}>
                            {
                                // props.PotInfo.currentEntries.filter()
                                props.PotInfo.participants.addresses.map((address, index, array) => {
                                    start = endIn
                                    endIn = start + props.PotInfo.participants.usdValue[index] * 359.8 / props.PotInfo.currentRoundTotalUsd

                                    if (address === undefined) {
                                        console.log("ADDRESS IS UNDEFINED")
                                        return ""
                                    } else {
                                        console.log("THIS IS THE ADDRESS: ", address, " AND THIS IS THE CORRESPONDING USD VALUE: ", props.PotInfo.participants.usdValue[index])
                                    }
                                    return (
                                        <path data-start={start} data-stop={endIn} key={index} id="arc1" d={describeArc(175, 175, circleRadius, start, endIn)} fill="none" stroke={stc((((address.toString().toLowerCase() + ""))))} strokeWidth="40" />
                                    )
                                })}
                        </svg>
                        :
                        <div className="wheel_inner1">
                            <div className={props.isDarkMode ? "wheel_inner2_dark" : "wheel_inner2"}>
                            </div>
                        </div>

                }
            </div>
            <div className="burn_bonus">
                <div>
                    Bonus added:
                    <div className="card">
                        <img src={plsp} alt='plsp logo' />
                        {props.PotInfo.participants.addresses.length > 0 ? "1 " + REACT_APP_PLSP_SYMBOL : (parseFloat(1 + parseFloat(props.PotInfo.currentRoundTotalUsd) / (10 ** 12)).toFixed(2)) + "  " + REACT_APP_PLSP_SYMBOL}
                    </div>
                </div>
            </div>
        </div >)

}


