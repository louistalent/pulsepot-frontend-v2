import './faqs.css'
import React, { useState } from 'react'
import arrow_down from '../../assets/images/down-arrow.png'
import arrow_left from '../../assets/images/left-arrow.png'
export default function Faqs() {
    const [faqs, setFaqs] = useState(
        {
            1:
            {
                question: "What is Decentralized PVP ?",
                answer: "Player Vs Player. This means that BNBPot is not a house that you  can play against. It’s a series of contracts where players can compete against each other in a decentralized and trustless manner,  at a very competitive  3% fee.  This removes counterparty risk and censorship.",
                opened: true
            },

            2:
            {
                question: "What tokens can be used with BNBPot?",
                answer: "BNBPot will whitelist a series of BEP20 tokens that will have sufficient liquidity on Pancakeswap. We want to make sure that our users are able to swap their winnings for any token of their choice on Pancakeswap. We expect 30 to 100 tokens to be whitelisted on BNBPot at any given point of time. Certain bridged-in tokens will also be whitelisted on BNBPot.",
                opened: false
            },
            3:
            {
                question: "How is the winner decided?",
                answer: "The contract takes a series of data from the block height, the hash, the timestamp and the current price of BNB to generate randomness. For every $5 a user sends to the pot, the user gets allotted a number. The more numbers a user has, the higher is their chance to own the winning number.",
                opened: false
            },
            4:
            {
                question: "What is BNBP staking ?",
                answer: "Only staked BNBP tokens are qualified for airdrops and lottery participation. All stakes are 100 days long. When a stake has served its 100 days, it can be unstaked at any time. A 100% matured stake, will stay staked and continue to earn rewards",
                opened: false
            },
            BNBP_MARKET_PRICE:
            {
                question: "What is the BNBPot Faucet?",
                answer: "All users can claim 0.01 BNB per address, one time. Users simply need to enter their address and click the “Claim” button. A maximum of 1,000 addresses can free claim each day. BNBPot offers this faucet to help the users who own PRC20s but didn’t sacrifice for PulseChain.",
                opened: false
            },
            6:
            {
                question: "What is the participation phase?",
                answer: "After Mainnet launch, all pots will have 1 BNBP added to the pot as a bonus. On top of that, 1 BNBP will be added to the pot for every 100 USD value added to the pot. The winner takes home these BNBP tokens as a bonus along with the tokens won from the pot. This will go on until 100,000 BNBP tokens have been given out in the form of bonuses. All BNBP earnings from the participation phase will be distributed at the end of the phase when all 100,000 tokens have been claimed.",
                opened: false
            },
            7:
            {
                question: "How does the $30 BNBP floor work ?",
                answer: "The BNBPot contract has a minimum value of $30 per BNBP hardcoded into the contract. BNBP is the only token with a minimum value in the pot. All other BEP20s follow Pancakeswap market price every 3 minutes. If the market price of BNBP goes above $30, the BNBPot contract follows the price up.",
                opened: false
            },
            8:
            {
                question: "What is the 10% feedback loop ?",
                answer: "BNBPot updates the token prices every 3 minutes. When the price of BNBP is $30 or more, the contract adds 10% to the BNBP price in the pot. This helps holders of tax tokens to swap into BNBP without losing betting value.",
                opened: false
            },
            9:
            {
                question: "What is the buy and burn ?",
                answer: "Every 24 hours the contract will use 20% of the accumulated fees to market buy BNBP. All BNBP are then automatically sent to the burn address.",
                opened: false
            },
            10:
            {
                question: "How does the monthly lottery work ?",
                answer: "5% of accumulated fees are reserved for a weekly lottery for BNBP holders. Holding 1 BNBP grants users 1 ticket in the lottery. Holding BNBP works as a passive lottery subscription for the holders. Every 7 days the contract will pick a random lottery winner, and the accrued value will be airdropped in BNBP tokens to the winning wallet.",
                opened: false
            },
            11:
            {
                question: "When will I get airdrops from holding BNBP ?",
                answer: "Every 30 days, 75% of the total accumulated fees is airdropped to BNBP holders. The contract will buy BNBP on the market from tokens accrued, and airdrop it back  to BNBP holders.",
                opened: false
            },
            12:
            {
                question: "How does the BNBP reduced fee work ?",
                answer: "BNBPot charges the pot winner a service fee of 3% of the total pot value. However, holding BNBP tokens reduces this fee. For every 1 BNBP the winner holds in their wallet, 0.5% of the total fee is laid off. For instance, holding 50 BNBP reduces the fee by 25% i.e. Holding 100 BNBP reduces the fee to 1.5% lowest possible rate.",
                opened: false
            },
            13:
            {
                question: "How is BNBP token distribution?",
                answer: "Total supply 1,000,000 BNBP. ●	800, 000 BNBP  to early sacrificers ●	100, 000 BNBP   to Participation phase wallet ●	100, 000 BNBP   to Team wallet",
                opened: false
            },
        }
    )
    return (
        <div className='card Page Faqs '>

            <div className='page_title  underline-yellow'>
                FAQ
            </div>
            <div className='page_content'>
                {
                    Object.keys(faqs).map((key, index) => {
                        return (
                            <div key={index} className="Faqs_ques_ans">
                                <div className={faqs[key].opened ? 'Faqs_ques Faqs_ques_open' : 'Faqs_ques'}>
                                    <div className='Faqs_ques_arrow' onClick={(e) => {
                                        setFaqs(prevState => ({
                                            ...prevState,
                                            [key]: {
                                                ...prevState[key],
                                                "opened": !prevState[key]["opened"]
                                            },

                                        }))
                                    }} >
                                        <img src={faqs[key].opened ? arrow_down : arrow_left} alt="arrow icon" />
                                    </div>
                                    <div className='Faqs_question_open' onClick={(e) => {
                                        setFaqs(prevState => ({
                                            ...prevState,
                                            [key]: {
                                                ...prevState[key],
                                                "opened": !prevState[key]["opened"]
                                            },

                                        }))
                                    }} >
                                        {faqs[key].question}
                                    </div>

                                </div>
                                {faqs[key].opened ?

                                    <div className='Faqs_ans'>
                                        {faqs[key].answer}
                                    </div>
                                    :
                                    ""}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
