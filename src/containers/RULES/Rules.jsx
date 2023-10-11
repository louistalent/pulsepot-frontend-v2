import React from 'react'
import './rules.css'
export default function Rules() {
    return (
        <div className='card Rules Page'>


            <div className='page_title  underline-yellow'>
                Games Rules
            </div>
            <div className='Page-subtle-content'>
                <div className="rules-list">
                    <span>1. </span>The minimum value to enter a pot is 5 USD. <br />
                    <span>2. </span>A player's winning chance is proportional to their entered value.<br />
                    <span>3. </span>A pot goes live when 2 unique addresses enter with value greater than 5 USD.<br />
                    <span>4. </span>Each pot has a countdown timer of 3 minutes after going live, then the winner will be calculated.<br />
                    <span>5. </span>An unlimited number of players can enter within the 3 minute window.<br />
                    <span>6. </span>An unlimited amount of value can be entered into the pot.<br />
                    <span>7. </span>Each player can make an unlimited number of entries into the same pot.<br />
                    <span>8. </span>Only whitelisted tokens are accepted into the pot.<br />
                    <span>9. </span>All token prices are updated every 3 minutes.<br />
                    <span>10. </span>The Pot fee is 1.5% to 3% of the total value.<br />
                    <span>11. </span>BNBP holders have a reduced fee.<br />
                    <span>12. </span>The fee is deducted from the token entered with the largest collective value.<br />
                    <span>13. </span>All value that is entered into the Pot will be distributed out of the contract within 3 minutes.<br />
                    <span>14. </span>The fees will be collected and held for distribution, lottery or buy and burn.<br />
                    <span>15. </span>Players can connect their wallet directly or execute a manual transaction with the contract to enter.<br />
                    <span>16. </span>To ensure total randomness the winner is calculated with a value based on several unique and unpredictable factors including the hash of the next block.<br />
                    <span>17. </span>The contract will deny any transaction using a token that is not whitelisted.
                </div>
            </div>

        </div>
    )
}
