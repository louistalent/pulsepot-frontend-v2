import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './games.css';
import pot_active from '../../../assets/images/Menu icons/Games section/color-wheel-bnb-active.png';
import running_inactive from '../../../assets/images/Menu icons/Games section/running-inactive.png';
import roulette_inactive from '../../../assets/images/Menu icons/Games section/roulette-inactive.png';
import line_chart_inactive from '../../../assets/images/Menu icons/Games section/line-chart-inactive.png';
import pot_inactive from '../../../assets/images/Menu icons/Games section/color-wheel-inactive.png';
import running_active from '../../../assets/images/Menu icons/Games section/running-bnb-active.png';
import roulette_active from '../../../assets/images/Menu icons/Games section/roulette-bnb-active.png';
import line_chart_active from '../../../assets/images/Menu icons/Games section/line-chart-bnb-active.png';

export default function Games(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMuted, setMuted] = useState(false);
  useEffect(() => {
    const value = window.localStorage.getItem('muted');
    if (value == 'true') {
      setMuted(true);
    }
  }, []);
  const onToggleMute = () => {
    window.localStorage.setItem('muted', !isMuted);
    setMuted(!isMuted);
  };

  return (
    <div className="MenuContent Games">
      <div
        className="menuTitle"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
      >
        GAMES
        <div className={isMenuOpen ? 'triangle-down' : 'triangle-forward'}></div>
      </div>
      <div className={isMenuOpen ? 'menuItems menuItems_dark' : 'menuItems menuItems_dark mobile_none '}>
        <div className={props.page === 1 ? 'menuItem CurrentGame' : 'menuItem'}>
          <Link
            to="/jackpot"
            onClick={() => {
              props.setPage(1);
              props.setShowMenu(false);
            }}
          >
            <img src={props.page === 1 ? pot_active : pot_inactive} alt="menu item" />
            JACKPOT
            <img src={`/assets/${isMuted ? 'mute' : 'volume'}.png`} onClick={onToggleMute} />
          </Link>
        </div>
        <div className={props.page === 2 ? 'menuItem CurrentGame' : 'menuItem'}>
          <Link
            to="/roulette"
            onClick={() => {
              props.setPage(2);
              props.setShowMenu(false);
            }}
          >
            <img src={props.page === 2 ? roulette_active : roulette_inactive} alt="menu item" />
            ROULETTE
          </Link>
        </div>
        <div className={props.page === 3 ? 'menuItem CurrentGame' : 'menuItem'}>
          <Link
            to="/fortunewheel"
            onClick={() => {
              props.setPage(3);
              props.setShowMenu(false);
            }}
          >
            <img src={props.page === 3 ? pot_active : pot_inactive} alt="menu item" />
            FORTUNE WHEEL
          </Link>
        </div>
        <div className={props.page === 4 ? 'menuItem CurrentGame' : 'menuItem'}>
          <Link
            to="/sports"
            onClick={() => {
              props.setPage(4);
              props.setShowMenu(false);
            }}
          >
            <img src={props.page === 4 ? running_active : running_inactive} alt="menu item" />
            SPORTS
          </Link>
        </div>
        <div className={props.page === 5 ? 'menuItem CurrentGame' : 'menuItem'}>
          <Link
            to="/pricecalls"
            onClick={() => {
              props.setPage(5);
              props.setShowMenu(false);
            }}
          >
            <img src={props.page === 5 ? line_chart_active : line_chart_inactive} alt="menu item" />
            PRICE CALLS
          </Link>
        </div>
      </div>
    </div>
  );
}
