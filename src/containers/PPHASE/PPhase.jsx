import { Link } from "react-router-dom";
import React from 'react'
import './pphase.css'
import logo from '../../assets/images/bnbp-blue.png'
export default function PPhase(props) {
    return (
        <div className='card PPhase Page'>
            <div className='page_title underline-yellow'>
                Participation Phase
            </div>

            <div className='Page-subtle-content'>
                <div className='p-phase-content'>
                    <div className='p-phase-content1'>
                        100,000 BNBP tokens have been alloted to the initial participation phase.
                        <br />
                        This will be a one-time event to support the launch and short-term growth of BNBPot.
                    </div>
                    <div className='p-phase-content2'>
                        <div className='user-pphase-amount'>
                            <img src={logo} alt='logo icon' />
                            {parseFloat(props.userPlsp.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </div>
                    </div>
                </div>

            </div>

            <div className='Page-subtle-content'>
                <div className='Page-subtle'>
                    How does it work?
                </div>
                <div>
                    - Every jackpot will have 1 BNBP bonus added by default.<br />
                    - For every 150 USD in the pot, 1 BNBP is added to the bonus.<br />
                    - Max. 20 BNBP bonus per jackpot.<br />
                    - Only the winner of the jackpot wins the BNBP bonus.<br />
                    - The participation phase ends when 100,000 BNBP have been won.<br />
                    - The BNBP Bonus tokens will be distributed when all 100,000 tokens have been won
                </div>
            </div>
            <div className='Page-subtle-content'>
                <div className='Page-subtle'>
                    Referral during the participation phase
                </div>
                <div>
                    - Earn 10% of all BNBP your referred players win.<br />
                    - Create your custom referral link <Link to="/referral" className='orange' >here</Link>
                </div>
            </div>
            <div className='Page-subtle-content'>
                <div className='Page-subtle'>
                    {parseFloat(props.totalPlspClaimed.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} BNBP have already been claimed
                </div>
                <div className='p-phase-progressbar'>
                    <div className='bgblue' style={{ width: (props.totalPlspClaimed * 100 / 100000) + "%" }}></div>
                </div>
            </div>
        </div>
    )
}
