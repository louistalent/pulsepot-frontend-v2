import React from "react";
import bnb from "../assets/images/bsc.png"
import pls from "../assets/images/pls.png"
import plsb from "../assets/images/bnbp-icon.png"
import usdt from "../assets/images/usdt.png"
import busd from "../assets/images/busd.png"
import link from "../assets/images/link.png"
import shib from "../assets/images/shib.png"
import hex from "../assets/images/hex.png"
import plsx from "../assets/images/plsx.png"
import matic from "../assets/images/matic.png"
import plsp from "../assets/images/logo.png"
import cardano from "../assets/images/cardano.png"
import plsd from "../assets/images/plsd.png"
import usdl from "../assets/images/usdl.png"
import loan from "../assets/images/loan.png"
import hdrn from "../assets/images/hdrn.png"
import cake from "../assets/images/pancakeswap.png"
import metamask from "../assets/images/metamask.png"
import ethereum from "../assets/images/ethereum-logo.png"
import xrp from "../assets/images/xrp.png"
import zil from "../assets/images/zil.png"
import wbnb from "../assets/images/metamask.png"
import usdc from "../assets/images/usdc.png"

import fantom from "../assets/images/ftm.png"
import chainlink from "../assets/images/link.png"
import avalanche from "../assets/images/avax.png"
import dogecoin from "../assets/images/doge.png"
import matictoken from "../assets/images/matic.png"
import ripple from "../assets/images/xrp.png"



export default function TokenImage(props) {

    var token_image;
    switch (props.token.toString()) {
        case "FTM":
            token_image = fantom;
            break;
        case "Fantom":
            token_image = fantom;
            break;

        case "LINK":
            token_image = chainlink;
            break;
        case "Chainlink":
            token_image = chainlink;
            break;

        case "AVAX":
            token_image = avalanche;
            break;
        case "Avalanche":
            token_image = avalanche;
            break;



        case "DOGE":
            token_image = dogecoin;
            break;
        case "Dogecoin":
            token_image = dogecoin;
            break;

        case "MATIC":
            token_image = matictoken;
            break;
        case "Matic token":
            token_image = matictoken;
            break;

        case "XRP":
            token_image = ripple;
            break;
        case "Ripple":
            token_image = ripple;
            break;



        case "USDC":
            token_image = usdc;
            break;
        case "WBNB":
            token_image = bnb;
            break;
        case "Wrapped BNB":
            token_image = bnb;
            break;
        case "ZIL":
            token_image = zil;
            break;
        case "Zilliqa":
            token_image = zil;
            break;

        case "XRP":
            token_image = xrp;
            break;
        case "XRP Token":
            token_image = xrp;
            break;

        case "ETH":
            token_image = ethereum;
            break;
        case "Ethereum":
            token_image = ethereum;
            break;



        case "BNB":
            token_image = bnb;
            break;
        case "PULSE":
            token_image = pls;
            break;
        case "ChainLink Token":
            token_image = pls;
            break;
        case "CAKE":
            token_image = cake;
            break;
        case "Cake":
            token_image = cake;
            break;
        case "Cardano Token":
            token_image = cardano;
            break;
        case "ADA":
            token_image = cardano;
            break;
        case "USD Tether":
            token_image = usdt;
            break;
        case "SHIBA INU":
            token_image = shib;
            break;
        case "Hex":
            token_image = hex;
            break;
        case "Pulse Exchange":
            token_image = plsx;
            break;
        case "Matic Token":
            token_image = matic;
            break;
        case "PLSP":
            token_image = plsp;
            break;
        case "BNBP":
            token_image = plsb;
            break;
        case "PLSD":
            token_image = plsd;
            break;
        case "LOAN":
            token_image = loan;
            break;
        case "Hedron":
            token_image = hdrn;
            break;
        case "USDL":
            token_image = usdl;
            break;
        case "PLS":
            token_image = pls;
            break;
        case "LINK":
            token_image = link;
            break;
        case "USDT":
            token_image = usdt;
            break;
        case "BUSD":
            token_image = busd;
            break;
        case "SHIBA":
            token_image = shib;
            break;
        case "HEX":
            token_image = hex;
            break;
        case "PLSX":
            token_image = plsx;
            break;
        case "MATIC":
            token_image = matic;
            break;
        case "HDRN":
            token_image = hdrn;
            break;
        case "MetaMask":
            token_image = metamask;
            break;
        default:
            token_image = bnb;
            break;
    }
    return (
        <img src={token_image} alt={props.token.toString()} className={props.class_name} />
    );
}
