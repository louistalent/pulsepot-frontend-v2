import './tokenSelection.css'
import React, { } from "react"
import SingleTokenWhitelist from '../../components/singleTokenWhitelist2/SingleTokenWhitelist'
export default function TokenSelection(props) {

    // const [tokenSearch, setTokenSearch] = useState("")
    return (
        <div className="tokenSelection">
            {/* <span className='closeTokenSelection' >close</span> */}
            <div className='tokenSelection__inner'>
                <div className='tokenSelection__inner-head hover' onClick={() => {
                    window.location.href = "https://bnbpot.io/swap";
                }}>
                    <div className='tokenSelection_10P'>
                        <div>
                            {30 > props.BNBPPrice ? ((30 / props.BNBPPrice) * 100 - 100).toFixed(0) : '10'}%
                        </div>
                        <div>
                            Premium
                        </div>
                    </div>

                    <div className='tokenSelection_10P_'>
                        Is your token not supported?
                        Swap to BNBP for a premium
                    </div>
                </div>

                {/* <input type="text" value={tokenSearch} onChange={(e) => setTokenSearch(e.target.value)} className="mobile__tokenSelection__inner-search" placeholder="Search Token..." /> */}
                <div className='hover'>

                    {
                        // .sort((a, b) => {
                        //     return parseInt(b[token]) - parseInt(a[token]);
                        // })
                        (Object.keys(props.tokens)).map((token) => {
                            return token
                        }).sort((token2, token1) => {
                            return parseFloat(props.tokens[token1]) - parseFloat(props.tokens[token2]);
                        }).map((token, index) => {
                            return (<SingleTokenWhitelist setShowToken={props.setShowToken} tokens={props._tokens} balance={props.tokens[token]} token={token} key={index} setEnterState={props.setEnterState} />)
                        })
                    }
                </div>

            </div>
        </div>
    )
}









