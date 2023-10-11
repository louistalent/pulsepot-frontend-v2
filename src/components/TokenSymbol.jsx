import React from "react";

export default function TokenSymbol(props) {

    var symbol;
    switch (props.name.toString()) {
        case "PULSE":
            symbol = "PLS";
            break;
        case "BNB":
            symbol = "BNB";
            break;
        case "ChainLink Token":
            symbol = "LINK";
            break;
        case "USD Tether":
            symbol = "USDT";
            break;
        case "CAKE":
            symbol = "CAKE";
            break;
        case "Ethereum":
            symbol = "ETH";
            break;
        case "CARDANO TOKEN":
            symbol = "ADA";
            break;
        case "Ethereum":
            symbol = "ETH";
            break;
        case "ETH":
            symbol = "ETH";
            break;
        case "Cake":
            symbol = "CAKE";
            break;
        case "Cardano Token":
            symbol = "ADA";
            break;
        case "USDT":
            symbol = "USDT";
            break;
        case "BUSD":
            symbol = "BUSD";
            break;
        case "SHIBA INU":
            symbol = "SHIB";
            break;
        case "Hex":
            symbol = "HEX";
            break;
        case "Pulse Exchange":
            symbol = "PLSX";
            break;
        case "Matic Token":
            symbol = "MATIC";
            break;
        case "PLSP":
            symbol = "PLSP";
            break;
        case "BNBP":
            symbol = "BNBP";
            break;
        case "LOAN":
            symbol = "LOAN";
            break;
        case "Hedron":
            symbol = "HDRN";
            break;
        case "Maximus":
            symbol = "MAXI";
            break;
        case "USDL":
            symbol = "USDL";
            break;
        case "USDC":
            symbol = "USDC";
            break;
        case "XRP Token":
            symbol = "XRP";
            break;


        case "Fantom":
            symbol = "FTM";
            break;
        case "Chainlink":
            symbol = "LINK";
            break;
        case "Avalanche":
            symbol = "AVAX";
            break;
        case "Dogecoin":
            symbol = "DOGE";
            break;
        case "Matic token":
            symbol = "MATIC";
            break;
        case "Ripple":
            symbol = "XRP";
            break;
        case "Wrapped BNB":
            symbol = "WBNB";
            break;
        case "WBNB":
            symbol = "WBNB";
            break;
        default:
            symbol = props.name.toString().toLowerCase();
            break;
    }
    return (
        <>
            {symbol}
        </>
    );
}
