import { Link } from "react-router-dom";
import './info.css'
import React, { useState } from 'react';
import rules from "../../../assets/images/Menu icons/Info section/rules.png"
import checked from "../../../assets/images/Menu icons/Info section/checked.png"
import referral from "../../../assets/images/Menu icons/Info section/referral.png"
import faq from "../../../assets/images/Menu icons/Info section/faq.png"
import about from "../../../assets/images/about.png"
import faucet from "../../../assets/images/faucet.png"
import pphase from "../../../assets/images/phase.png"

export default function Info(props) {
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    return (
        <div className="MenuContent Info">
            <div className='menuTitle' onClick={() => {
                setIsMenuOpen(!isMenuOpen)
            }}>
                INFO
                <div className={isMenuOpen ? "triangle-down" : "triangle-forward"}>
                </div>
            </div>
            <div className={isMenuOpen ? 'menuItems' : ' menuItems mobile_none  '}>
                <div className={props.page === 9 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(9); props.setShowMenu(false) }}>
                    <Link to="/about">
                        <img src={about} alt="menu item" />ABOUT
                    </Link>
                </div>
                {/* <div className={props.page === 10 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(10); props.setShowMenu(false) }}>
                    <Link to="/faucet">
                        <img src={faucet} alt="menu item" />FAUCET
                    </Link>
                </div> */}
                <div className={props.page === 11 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(11); props.setShowMenu(false) }}>
                    <Link to="/pphase">
                        <img src={pphase} alt="menu item" />PARTICIPATION
                    </Link>
                </div>
                <div className={props.page === 12 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(12); props.setShowMenu(false) }}>
                    <Link to="/rules">
                        <img src={rules} alt="menu item" />RULES
                    </Link>
                </div>
                <div className={props.page === 13 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(13); props.setShowMenu(false) }}>
                    <Link to="/tokens">
                        <img src={checked} alt="menu item" />ACCEPTED TOKENS
                    </Link>
                </div>
                <div className={props.page === 14 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(14); props.setShowMenu(false) }}>
                    <Link to="/referral">
                        <img src={referral} alt="menu item" />REFERRAL
                    </Link>
                </div>
                <div className={props.page === 15 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(15); props.setShowMenu(false) }}>
                    <Link to="/faqs">
                        <img src={faq} alt="menu item" />FAQ
                    </Link>
                </div>
            </div>
        </div>
    )
}
