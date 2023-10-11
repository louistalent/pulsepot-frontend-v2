import { Link } from 'react-router-dom';
import './plsp.css';
import React, { useState } from 'react';
import trade from '../../../assets/images/Menu icons/Token section/trade.png';
import stake from '../../../assets/images/Menu icons/Token section/stake.png';
import tokenomics from '../../../assets/images/Menu icons/Token section/tokenomics.png';
require('dotenv').config();

const REACT_APP_PLSP_SYMBOL = process.env.REACT_APP_PLSP_SYMBOL;

export default function Plsp(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)

  return (
    <div className="MenuContent Plsp">
      <div className="menuTitle" onClick={() => {
        setIsMenuOpen(!isMenuOpen)
      }}>
        {REACT_APP_PLSP_SYMBOL}
        <div className={isMenuOpen ? "triangle-down" : "triangle-forward"}>
        </div>
      </div>
      <div className={isMenuOpen ? 'menuItems' : ' menuItems mobile_none  '}>
        <div style={{ position: "relative" }} className={props.page === 6 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(6); props.setShowMenu(false) }}>
          <Link to="/swap">
            <img src={trade} alt="menu item" />
            SWAP
            <div className='MenuItem_mobile_pos menu_bnbp_mprice' >
              ${(props.BNBP_MARKET_PRICE)}
            </div>
          </Link>
        </div>
        <div className={props.page === 7 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(7); props.setShowMenu(false) }}>
          <Link to="/stake">
            <img src={stake} alt="menu item" />
            STAKE
          </Link>
        </div>
        <div className={props.page === 8 ? "menuItem CurrentMenuItem" : "menuItem"} onClick={() => { props.setPage(8); props.setShowMenu(false) }}>
          <Link to="/tokenomics">
            <img src={tokenomics} alt="menu item" />
            TOKENOMICS
          </Link>
        </div>
      </div>
    </div>
  );
}
