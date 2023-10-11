import React from 'react'
import './about.css'
export default function About() {
    return (

        <div className='card About Page'>
            <div className='page_title  underline-yellow'>
                About
            </div>
            <div className='Page-subtle-content'>
                Worlds first truly decentralized casino. BNBPot is simply a web3 application that visualize the events & activities of smart contracts on blockchains
            </div>

            <div className='Page-subtle-content'>
                <div className='Page-subtle'>
                    Why decentralize a casino?
                </div>
                <div>
                    1. Guaranteed fairness in the games. All game code is transparent and on-chain. <br />
                    2. Guaranteed payouts. Instant payouts directly to your wallet everytime you win. <br />
                    3. No censorship. Anyone with a wallet and crypto can enter the games. <br />
                    4. Lowest fees and highest RTP in the industry <br />
                    5. All profits are distributed in a completely decentralized and automated manner to BNBP holders
                </div>
            </div>
            <div className='Page-subtle-content'>
                <div className='Page-subtle'>
                    Player vs. Player concept
                </div>
                <div>
                    All games on BNBPot is developed to be player vs player. We match players against eachother in a secure and decentralized way. This means that BNBPot simply provides a series of decentralized contracts that players can choose to interact with. You can never win value from BNBPot
                </div>
            </div>
            <div className='Page-subtle-content'>
                <div className='Page-subtle'>
                    Profit Sharing
                </div>
                <div>
                    All games on BNBPot is associated with a fee from 1.5% to 3%. This fee is deducted from the winner. <br />
                    These fees are automatically distributed to holders of BNBP token.
                </div>
            </div>

        </div>
    )
}
