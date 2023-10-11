import { Link } from "react-router-dom";
import './stats.css'
import React, { useState } from 'react';
import airdrop from "../../../assets/images/Menu icons/Stats section/airdrop.png"
// import timeLeft from "../../../assets/images/Menu icons/Stats section/time-left.png"
import lottery from "../../../assets/images/Menu icons/Stats section/lottery.png"
import burn from "../../../assets/images/Menu icons/Stats section/burn.png"
import stake from "../../../assets/images/Menu icons/Stats section/stake.png"
import logo from "../../../assets/images/bnbp-icon.png"
import statistics from "../../../assets/images/bnbp-icon.png"



export default function Stats(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    }

    return (
        <div className='MenuContent Stats'>
            <div className='menuTitle' onClick={() => {
                setIsMenuOpen(!isMenuOpen)
            }}>
                STATS
                <div>
                    <img src={logo} alt='clock icon' />
                    <div className={isMenuOpen ? "triangle-down" : "triangle-forward"}>
                    </div>
                </div>
            </div>
            <div className={isMenuOpen ? 'menuItems' : ' menuItems mobile_none  '}>
                <div className='menuItem'>
                    <img src={airdrop} alt="menu item" />
                    AIRDROP
                    <div>
                        {kFormatter(props.potInfo.airdrop.toFixed(1))}
                        {/* <img src={logo} alt='clock icon' /> */}
                    </div>
                </div>
                <div className='menuItem'>
                    <img src={lottery} alt="menu item" />
                    LOTTERY
                    <div>
                        {kFormatter(props.potInfo.lottery.toFixed(1))}
                        {/* <img src={logo} alt='clock icon' /> */}
                    </div>
                </div>
                <div className='menuItem'>
                    <img src={burn} alt="menu item" />
                    BURN
                    <div>
                        {kFormatter(props.potInfo.burn.toFixed(1))}
                        {/* <img src={logo} alt='clock icon' /> */}
                    </div>
                </div>
                <div className='menuItem'>
                    <img src={stake} alt="menu item" />
                    STAKED
                    <div>
                        {(props.potInfo.stake * 100).toFixed(2)}%
                        {/* <img src={logo} alt='clock icon' /> */}
                    </div>
                </div>
                {/* <div className={props.page === 16 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(16); props.setShowMenu(false) }}>
                    <Link to="/faqs">
                        <img src={statistics} alt="menu item" />ALL STATISTICS
                    </Link>
                </div> */}
            </div>
        </div>
    )
}
