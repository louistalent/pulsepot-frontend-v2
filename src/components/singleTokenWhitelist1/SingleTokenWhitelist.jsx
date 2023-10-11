import "./singleTokenWhitelist.css"
import React from "react";
import TokenImage from "../../components/TokenImage";
import bnbp from '../../assets/images/bnbp-icon.png'
export default function SingleTokenWhitelist(props) {

    var tokenImage = {
        "BNB": `https://bscscan.com/token/images/binance_32.png`,
        "BNBP": `https://bnbpot.io/bnbp-icon.png`,
        "Wrapped BNB": `https://bscscan.com/token/images/binance_32.png`,
        "BUSD": `https://bscscan.com/token/images/busd_32.png`,
        "USDT": `https://bscscan.com/token/images/busdt_32.png`,
        "USDC": `https://bscscan.com/token/images/centre-usdc_28.png`,
        "Ethereum": `https://bscscan.com/token/images/ethereum_32.png`,
        "XRP Token": `https://bscscan.com/token/images/xrp_32.png`,
        "Cardano Token": `https://bscscan.com/token/images/cardano_32.png`,
        "Zilliqa": `https://bscscan.com/token/images/zilliqa_32.png`,
        "Cake": `https://bscscan.com/token/images/pancake_32.png`,
        "SHIBA INU": `https://bscscan.com/token/images/shibatoken_32.png`,
        "LOAN": "",
        "Pulse Exchange": "",
        "Maximus": "",
        "PLSP": "",
        "Hedron": "",
        "USDL": "",
        "Hex": "",

    }




    return (
        <div className="singleToken-whitelist1">
            <TokenImage token={props.token} class_name={""} />
            <div className="singleToken-whitelist1_token">
                {(props.tokens.filter((token) => { return token.name === props.token }).map((token) => { return token.symbol }))}
            </div>
            <div className="singleToken-whitelist1_balance">$ {parseFloat((parseFloat(parseInt(props.tokens.filter((token) => { return token.name === props.token }).map((token_) => { return token_.price })) / 10 ** 10)).toFixed(2))}
            </div>
            <div className="singleToken-whitelist1-add-MT hover" onClick={() => {

                if (props.token.toString() === "BNB")
                    return
                try {
                    const wasAdded = window.___provider.request({
                        method: 'wallet_watchAsset',
                        params: {
                            type: 'ERC20', // Initially only supports ERC20, but eventually more!
                            options: {
                                address: (props.tokens.filter((token) => { return token.name === props.token }).map((token_) => { return token_.address })).toString(), // The address that the token is at.
                                symbol: (props.tokens.filter((token) => { return token.name === props.token }).map((token) => { return token.symbol })).toString(), // A ticker symbol or shorthand, up to 5 chars.
                                decimals: parseInt(props.tokens.filter((token) => { return token.name === props.token }).map((token_) => { return token_._decimal })), // The number of decimals in the token
                                image: tokenImage[props.token],
                            },
                        },
                    });

                    if (wasAdded) {
                        console.log('Thanks for your interest!');
                    } else {
                        console.log('Your loss!');
                    }
                } catch (error) {
                    console.log(error);
                }
            }}>
                Add <TokenImage token={"MetaMask"} class_name={""} />
            </div>
            <div>
                {(props.tokens.filter((token) => { return token.name === props.token }).map((token_) => { return token_.address }))}
            </div>
        </div >
    );
}
