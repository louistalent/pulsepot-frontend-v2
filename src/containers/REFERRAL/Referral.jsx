import React from 'react'
import './referral.css'
import copy from "../../assets/images/copy.png"
import person from "../../assets/images/user-referral.png"
import logo from "../../assets/images/bnbp-blue.png"

require('dotenv').config()

export default function Referral(props) {
    return (
        <div className='card Referral Page'>

            <div className='page_title underline-yellow'>
                Referral Page
            </div>
            <div className='Page-subtle-content'>
                Share your custom referral link and earn BNBP during the participation phase
            </div>

            <div className='Page-subtle-content'>
                <div className='referral-copy' >
                    <div>{props.account.length > 0 ? "https://bnbpot.io/r/" + props.userInfo.code : props.userInfo.code}</div>
                    <img className='hover' src={copy} alt='copy icon' onClick={(e) => {
                        window.navigator.clipboard.writeText('https://bnbpot.io/r/' + props.userInfo.code);
                        (e.target.parentElement.style.background = "#edf8d8")
                        setTimeout(() => {
                            (e.target.parentElement.style.background = "")
                        }, 500)
                    }} />
                </div>
            </div>
            <div className='Page-subtle-content'>
                Referral Statistics:
            </div>

            <div className='Page-subtle-content'>
                <div className='referral-statistics'>
                    <img alt="referral logo" src={person} />
                    {props.userInfo.act_ref_users}
                </div>
                <div className='referral-statistics'>
                    <img src={logo} alt="bnbp logo" />
                    {parseFloat((props.userInfo["referrerEarnings"]).toFixed(3)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
            </div>

            <div className='Page-subtle-content'>
                All BNBP earned during the participation phase will be distributed when all 100,000 BNBP tokens have been claimed. This is a one time event
            </div>
            <div className='Page-subtle-content referral-pphase-progress'>
                <div className='Page-subtle'>
                    {parseFloat(props.totalPlspClaimed.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} BNBP <span>have already been claimed</span>
                </div>
                <div className='p-phase-progressbar'>
                    <div className='bgblue' style={{ width: (props.totalPlspClaimed * 100 / 100000) + "%" }}></div>
                </div>
            </div>


        </div>

    )
}
