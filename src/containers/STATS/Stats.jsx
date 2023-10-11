import { Link } from "react-router-dom";
import React from 'react'
import './stats.css'
// import logo from '../../assets/images/logo.png'
import countdown from '../../assets/images/time.png'
import CountdownTimer from "react-component-countdown-timer";
export default function Stats(props) {
    return (
        <div className='card stats Page'>

            <div className='page_title  underline-yellow'>
                Statistics
            </div>

            <div className='stats_overview'>
                <div className="overview">
                    <div className="orange overviewe1">
                        $274,502
                    </div>
                    <div className="overviewe2">
                        Highest single win
                    </div>
                    <div className="overviewe3">
                        Pot #472
                    </div>
                </div>
                <div className="overview">
                    <div className="orange overviewe1">
                        0.003
                    </div>
                    <div className="overviewe2">
                        Luckiest winner
                    </div>
                    <div className="overviewe3">
                        $19,563
                    </div>
                </div>
                <div className="overview">
                    <div className="orange overviewe1">
                        4,453
                    </div>
                    <div className="overviewe2">
                        Total unique wallets
                    </div>
                    <div className="overviewe3">
                        53 today
                    </div>
                </div>
                <div className="overview">
                    <div className="orange overviewe1">
                        $21,405,602
                    </div>
                    <div className="overviewe2">
                        Total volume
                    </div>
                    <div className="overviewe3">
                        All time
                    </div>
                </div>
            </div>
            <div className='Page-subtle-content'>
                <div className="statspage_title">
                    Today
                </div>
            </div>
        </div>
    )
}
