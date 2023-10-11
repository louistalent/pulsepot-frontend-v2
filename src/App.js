import './App.css';
import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Menu from './containers/Menu/Menu';
import Navbar from './components/navbar/Navbar';
import TermsModal from './components/TermsModal';

const Home = React.lazy(() => import('./containers/HOME/Home'));
const StakingPage = React.lazy(() => import('./containers/STAKE'));
const Faqs = React.lazy(() => import('./containers/FAQS/Faqs'));
const Referral = React.lazy(() => import('./containers/REFERRAL/Referral'));
const Rules = React.lazy(() => import('./containers/RULES/Rules'));
const Tokens = React.lazy(() => import('./containers/TOKENS/Tokens'));
const Roullete = React.lazy(() => import('./containers/ROULETTE/Roulette'));
const Sports = React.lazy(() => import('./containers/SPORTS/Sports'));
const PriceCalls = React.lazy(() => import('./containers/PRICECALLS/PriceCalls'));
const PPhase = React.lazy(() => import('./containers/PPHASE/PPhase'));
const About = React.lazy(() => import('./containers/ABOUT/About'));
const Tokenomics = React.lazy(() => import('./containers/TOKENOMICS/Tokenomics'));
const FortuneWheel = React.lazy(() => import('./containers/FORTUNEWHEEL/FortuneWheel'));
const Swap = React.lazy(() => import('./containers/SWAP/Swap'));
const Stats = React.lazy(() => import('./containers/STATS/Stats'));

const REACT_APP_PLSP = process.env.REACT_APP_PLSP;

export default function App(props) {
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const clickAccepted = () => {
    localStorage.setItem('accepted_terms', true);
    setAcceptedTerms(true);
  };

  useEffect(() => {
    const accepted = localStorage.getItem('accepted_terms');
    if (!accepted) setAcceptedTerms(false);
  }, []);

  return (
    <div
      className={props.isDarkMode ? 'App dark_bg' : 'App light_bg'}
      onClick={() => {
        props.setShowChain(false);
        props.setShowToken(false);
        props.setShowMenu(false);
      }}
      onScroll={(e, r) => {
        if (document.getElementsByClassName('App')[0].scrollTop > 20) {
          document.getElementsByClassName('mobile-header')[0].style.backgroundColor = 'rgb(45 46 54)';
          document.getElementsByClassName('mobile-header')[0].style.boxShadow = 'rgb(25 26 24) -1px 4px 7px 4px';
          document.getElementsByClassName('mobile-header')[0].style['border-radius'] = ' 0px 0px 20px 20px';
        } else {
          document.getElementsByClassName('mobile-header')[0].style.backgroundColor = '';
          document.getElementsByClassName('mobile-header')[0].style.boxShadow = '';
        }
      }}
    >
      <Menu
        setShowToken={props.setShowToken}
        showToken={props.showToken}
        potAddress={props.potAddress}
        PULSEPOT={props.PULSEPOT}
        userInfo={props.PULSEPOT.userInfo}
        connectWallet={props.connectWallet}
        BNBP_MARKET_PRICE={props.PULSEPOT.BNBP_MARKET_PRICE}
        userPlsp={props.PULSEPOT.userInfo['BNBP_balance']}
        totalPlspClaimed={props.PULSEPOT.potInfo['p_phase' + REACT_APP_PLSP]}
        setShowMenu={props.setShowMenu}
        showMenu={props.showMenu}
        page={props.page}
        setPage={props.setPage}
        isDarkMode={props.isDarkMode}
        setDarkMode={props.setDarkMode}
        potInfo={props.PULSEPOT.potInfo}
        APP_PLSP={props.PULSEPOT[REACT_APP_PLSP]}
      />
      <div>
        <Navbar
          setShowMenu={props.setShowMenu}
          showMenu={props.showMenu}
          isDarkMode={props.isDarkMode}
          connectWallet={props.connectWallet}
          userInfo={props.PULSEPOT.userInfo}
          APP_PLSP={props.PULSEPOT[REACT_APP_PLSP]}
          setShowChain={props.setShowChain}
          showChain={props.showChain}
        />
        <Suspense fallback={<div>...loading</div>}>
          <Routes>
            <Route
              index
              element={
                <Home
                  setShowToken={props.setShowToken}
                  showToken={props.showToken}
                  potAddress={props.potAddress}
                  PULSEPOT={props.PULSEPOT}
                  isDarkMode={props.isDarkMode}
                  connectWallet={props.connectWallet}
                />
              }
              isDarkMode={props.isDarkMode}
            />
            <Route
              path="live"
              element={
                <Home
                  setShowToken={props.setShowToken}
                  showToken={props.showToken}
                  potAddress={props.potAddress}
                  PULSEPOT={props.PULSEPOT}
                  isDarkMode={props.isDarkMode}
                  connectWallet={props.connectWallet}
                />
              }
            />
            {/* <Route path="faucet" element={<Faucet />} isDarkMode={props.isDarkMode} /> */}
            <Route path="stake" element={<StakingPage PULSEPOT={props.PULSEPOT} isDarkMode={props.isDarkMode} />} />
            <Route path="swap" element={<Swap isDarkMode={props.isDarkMode} PULSEPOT={props.PULSEPOT} />} />
            <Route path="faqs" element={<Faqs />} />
            <Route
              path="referral"
              element={
                <Referral
                  userInfo={props.PULSEPOT.userInfo}
                  isDarkMode={props.isDarkMode}
                  APP_PLSP={props.PULSEPOT[REACT_APP_PLSP]}
                  account={props.PULSEPOT.userInfo.account}
                  totalPlspClaimed={props.PULSEPOT.potInfo['p_phase' + REACT_APP_PLSP]}
                />
              }
            />
            <Route path="rules" element={<Rules isDarkMode={props.isDarkMode} />} />
            <Route path="tokens" element={<Tokens isDarkMode={props.isDarkMode} tokens={props.PULSEPOT.tokens} />} />
            <Route path="pricecalls" element={<PriceCalls />} />
            <Route path="roulette" element={<Roullete />} />
            <Route path="sports" element={<Sports />} />
            <Route
              path="jackpot"
              element={
                <Home
                  setShowToken={props.setShowToken}
                  showToken={props.showToken}
                  potAddress={props.potAddress}
                  PULSEPOT={props.PULSEPOT}
                  isDarkMode={props.isDarkMode}
                  connectWallet={props.connectWallet}
                />
              }
            />
            <Route path="tokenomics" element={<Tokenomics />} />
            <Route path="fortunewheel" element={<FortuneWheel />} />
            <Route
              path="pphase"
              element={
                <PPhase
                  userPlsp={props.PULSEPOT.userInfo['p_phase' + REACT_APP_PLSP]}
                  totalPlspClaimed={props.PULSEPOT.potInfo['p_phase' + REACT_APP_PLSP]}
                />
              }
            />
            <Route path="about" element={<About />} />
            <Route
              path="*"
              element={
                <Home
                  setShowToken={props.setShowToken}
                  showToken={props.showToken}
                  potAddress={props.potAddress}
                  PULSEPOT={props.PULSEPOT}
                  isDarkMode={props.isDarkMode}
                  connectWallet={props.connectWallet}
                />
              }
            />
          </Routes>
        </Suspense>
      </div>
      <TermsModal open={!acceptedTerms} onClose={clickAccepted} />
    </div>
  );
}
