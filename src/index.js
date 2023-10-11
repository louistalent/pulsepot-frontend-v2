import './index.css';
import PotAbi from './abis/pot.json';
import PLSPAbi from './abis/PLSP.json';

import App from './App';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Provider from 'web3-react';

require('dotenv').config();

const query_url = process.env.REACT_APP_QUERY_URL;
const pot_contract_address = process.env.REACT_APP_POT_CONTRACT_ADDRESS;
const plsp_contract_address = process.env.REACT_APP_BNBP_CONTRACT_ADDRESS;
const REACT_APP_PLSP = process.env.REACT_APP_PLSP;

window.__web3 = new Web3('https://bsc-dataseed1.binance.org/');

window.PotContract = new window.__web3.eth.Contract(PotAbi, pot_contract_address);
window.PLSPContract = new window.__web3.eth.Contract(PLSPAbi, plsp_contract_address);

export default function Index(props) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showChain, setShowChain] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [page, _setPage] = useState(1);
  const setPage = (page) => {
    const element = document.querySelector('.Home_content1');
    if (element === null) {
      setTimeout(() => {
        setPage(page)

      }, 1000);
    }
    _setPage(page);
    if (page === 1) {
      setTimeout(() => {
        if (element && element.offsetWidth) {
          let width__ = element.offsetWidth / 2;
          document.querySelector('.Navbar').style.gridTemplateColumns = width__ + 'px ' + width__ + 'px ';
        }
      }, 1000);
    } else {
      // setTimeout(() => {
      console.log("Page id::: ", page)
      document.querySelector('.Navbar').style.gridTemplateColumns = ' 3fr 2fr';
      // }, 500);
    }
  };
  const [PULSEPOT, SETPULSEPOT] = useState({
    PotContractAddress: '',
    userInfo: {
      account: '',
      code: 'Please connect your wallet',
      [REACT_APP_PLSP]: 0,
      staked: 0,
      referrerEarnings: 0,
      ['p_phase' + REACT_APP_PLSP]: 0,
      BNBP_balance: 0,
      BNBP_stake: 0,
      act_ref_users: 0,
    },
    potInfo: {
      potRound: 0,
      stake: 0,
      burn: 0,
      airdrop: 0,
      lottery: 0,
      duration: 180,
      ['p_phase' + REACT_APP_PLSP]: 0,
    },
    tokens: [],
    [REACT_APP_PLSP]: 300000000000,
    BNBP_MARKET_PRICE: 0.0,
    provider: null,
  });

  const options = new WalletConnectProvider({
    rpc: {
      56: 'https://bsc-dataseed1.binance.org',
    },
    // infuraId: INFURA_ID,
  });

  // const providerOptions = {
  //   walletconnect: {
  //     package: WalletConnectProvider, // required
  //     options: options,
  //   },
  // };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectConnector,
      // options: {
      //   options
      // }
    },
    // coinbasewallet: {
    //   package: CoinbaseWalletSDK,
    //   options: {
    //     appName: "Web3Modal Example App",
    //     infuraId
    //   }
    // }
  };

  const subscribeProvider = (provider) => {
    if (!provider.on) {
      return;
    }

    localStorage.setItem('isWalletConnected', true);
    provider.on('accountsChanged', (accounts) => {
      if (accounts[0] === undefined) {
        localStorage.setItem('isWalletConnected', false);
      } else {
        localStorage.setItem('isWalletConnected', true);
      }
      SETPULSEPOT((prevState) => ({
        ...prevState,
        userInfo: {
          ...prevState.userInfo,
          account: accounts[0] === undefined ? '' : accounts[0],
        },
      }));
    });

    provider.on('chainChanged', async (networkId) => {
      if (await switchNetwork()) {
        SETPULSEPOT((prevState) => ({
          ...prevState,
          userInfo: {
            ...prevState.userInfo,
            account: provider.selectedAddress === undefined ? '' : provider.selectedAddress,
          },
        }));
      } else {
        SETPULSEPOT((prevState) => ({
          ...prevState,
          userInfo: {
            ...prevState.userInfo,
            account: '',
          },
        }));
      }
    });

    provider.on('disconnect', (error) => {
      localStorage.setItem('isWalletConnected', false);
    });
  };

  const web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true, // optional
    providerOptions, // required
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install a Wallet extension to connect');
      return;
    }
    try {
      const provider = await web3Modal.connect();
      window.___provider = await provider;

      subscribeProvider(provider);

      if (await switchNetwork()) {
        SETPULSEPOT((prevState) => ({
          ...prevState,
          userInfo: {
            ...prevState.userInfo,
            account: provider.selectedAddress === undefined ? '' : provider.selectedAddress,
          },
        }));
      } else {
        SETPULSEPOT((prevState) => ({
          ...prevState,
          userInfo: {
            ...prevState.userInfo,
            account: '',
          },
        }));
      }
    } catch (error) {
      SETPULSEPOT((prevState) => ({
        ...prevState,
        userInfo: {
          ...prevState.userInfo,
          account: '',
        },
      }));
    }
  };

  const getNetworkId = async () => {
    const currentChainId = await window.__web3.eth.net.getId();
    return currentChainId;
  };

  const switchNetwork = async () => {
    return true
    // const currentChainId = await getNetworkId();
    const chainId = process.env.REACT_APP_CHAIN_ID;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(chainId) }],
      });

      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await addNetwork();
          return true;
        } catch (error) {
          return false;
        }
      }
      return false;
    }
  };

  const addNetwork = async () => {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: Web3.utils.toHex(process.env.REACT_APP_CHAIN_ID),
          chainName: process.env.REACT_APP_CHAIN_NAME,
          nativeCurrency: {
            name: 'Binance Coin',
            symbol: process.env.REACT_APP_NATIVE_TOKEN_SYMBOL,
            decimals: 18,
          },
          rpcUrls: [process.env.REACT_APP_CHAIN_RPC],
          blockExplorerUrls: [process.env.REACT_APP_CHAIN_EXPLORER_URL],
        },
      ],
    });
  };
  const setDarkMode = (darkMode) => {
    return;
    darkMode = true;
    try {
      if (darkMode === true) {
        document.body.style.backgroundColor = '#2d2e36';
        document.body.style.color = '#c5c5c5';
        setIsDarkMode(true);
        localStorage.setItem('isDarkMode', true);
      } else {
        document.body.style.backgroundColor = '#f7f8fa';
        document.body.style.color = '#303030';
        setIsDarkMode(false);
        localStorage.setItem('isDarkMode', false);
      }
    } catch (error) { }
  };

  useEffect(() => {
    let pageId = window.location.href.split('/')[window.location.href.split('/').length - 1];
    switch (pageId) {
      case '':
        setPage(1);
        break;
      case 'roulette':
        setPage(2);
        break;
      case 'fortunewheel':
        setPage(3);
        break;

      case 'sports':
        setPage(4);
        break;
      case 'pricecalls':
        setPage(5);
        break;
      case 'swap':
        setPage(6);
        break;
      case 'stake':
        setPage(7);
        break;
      case 'tokenomics':
        setPage(8);
        break;
      case 'about':
        setPage(9);
        break;
      // case 'faucet':
      //   setPage(10);
      //   break;
      case 'pphase':
        setPage(11);
        break;
      case 'rules':
        setPage(12);
        break;
      case 'tokens':
        setPage(13);
        break;
      case 'referral':
        setPage(14);
        break;
      case 'faqs':
        setPage(15);
        break;
      default:
        setPage(1);
        break;
    }
    function set_page_r() {
      const element = document.querySelector('.Home_content1');
      if (element === null) {
        setTimeout(() => {
          set_page_r()
        }, 1000);
      } else (
        console.log("ELEMENT: ", element)
      )
      if (pageId === 'live' || pageId === '' || pageId === 'jackpot') {
        if (element && element.offsetWidth) {
          let width__ = element.offsetWidth / 2;
          document.querySelector('.Navbar').style.gridTemplateColumns = width__ + 'px ' + width__ + 'px';
        }
      } else {
        document.querySelector('.Navbar').style.gridTemplateColumns = ' 3fr 2fr';
      }
    }
    set_page_r()
  }, [page]);

  useEffect(() => {
    setDarkMode(localStorage.getItem('isDarkMode') === 'true');
    const getInfo = async () => {
      //Get neccesary information from the database
      let data;
      window.PLSPContract.methods
        .getTotalStakingAmount()
        .call()
        .then((total_staked) => {
          window.PLSPContract.methods
            .totalUserBalance()
            .call()
            .then((totalUserBalance) => {
              SETPULSEPOT((prevState) => ({
                ...prevState,
                potInfo: {
                  ...prevState.potInfo,
                  stake:
                    parseFloat(window.__web3.utils.fromWei(total_staked, 'ether')) /
                    parseFloat(window.__web3.utils.fromWei(totalUserBalance, 'ether')),
                },
              }));
            });
        });
      try {
        const response = await fetch(query_url + '/pulsepot/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        data = await response.json();
        if (data.error) {
          return;
        }
        SETPULSEPOT((prevState) => ({
          ...prevState,
          tokens: data.tokens,
          potInfo: {
            ...prevState.potInfo,
            ['p_phase' + REACT_APP_PLSP]: data.totalPlspClaimed,
          },
          [REACT_APP_PLSP]: parseFloat(
            data.tokens.filter((token) => token.name === REACT_APP_PLSP).map((token) => token.price)
          ).toFixed(2),
        }));
      } catch (error) {
        alert('There was an error connecting to network');
        console.log(error);
      }
      try {
        window.PotContract.methods
          .potDuration()
          .call()
          .then((duration) => {
            window.PotContract.methods
              .burnPool()
              .call()
              .then((burnPool) => {
                window.PotContract.methods
                  .airdropPool()
                  .call()
                  .then((airdropPool) => {
                    window.PotContract.methods
                      .lotteryPool()
                      .call()
                      .then((lotteryPool) => {
                        SETPULSEPOT((prevState) => ({
                          ...prevState,
                          potInfo: {
                            ...prevState.potInfo,
                            // "potRound": parseInt(potCount),
                            airdrop: parseFloat(window.__web3.utils.fromWei(airdropPool, 'ether')),
                            burn: parseFloat(window.__web3.utils.fromWei(burnPool, 'ether')),
                            lottery: parseFloat(window.__web3.utils.fromWei(lotteryPool, 'ether')),
                            duration: duration,
                          },
                        }));
                      });
                  });
              });
          });
      } catch (error) {
        alert('There was an error getting pot info');
        console.log(error);
      }
    };

    const getPrice = async () => {
      try {
        let data;
        const response = await fetch(
          'https://api.dexscreener.com/latest/dex/tokens/' + '0x4D9927a8Dc4432B93445dA94E4084D292438931F',
          {}
        );
        data = await response.json();

        SETPULSEPOT((prevState) => ({
          ...prevState,
          BNBP_MARKET_PRICE: parseFloat(data.pairs[0].priceUsd).toFixed(2),
        }));
      } catch (error) {
        console.log('Failed to fetch: ', error);
      }
    };
    getPrice();
    try {
      setTimeout(() => {
        if (localStorage.getItem('isWalletConnected') === 'true') {
          connectWallet();
        }
      }, 2000);
    } catch (error) { }
    getInfo();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      //Get neccesary information from the database

      function getUserBalance() {
        try {
          window.PLSPContract.methods
            .balanceOf(PULSEPOT.userInfo.account)
            .call()
            .then((balance) => {
              window.PLSPContract.methods
                .userStakingAmount(PULSEPOT.userInfo.account)
                .call()
                .then((user_staked) => {
                  SETPULSEPOT((prevState) => ({
                    ...prevState,
                    userInfo: {
                      ...prevState.userInfo,
                      BNBP_balance: parseFloat(window.__web3.utils.fromWei(balance, 'ether')) - parseFloat(window.__web3.utils.fromWei(user_staked, 'ether')),
                      BNBP_stake: parseFloat(window.__web3.utils.fromWei(user_staked, 'ether')),
                    },
                  }));
                });
            });
        } catch (error) {
          console('there was an error');
        }
      }
      if (!window.__web3.utils.isAddress(PULSEPOT.userInfo.account)) {
        return;
      }
      getUserBalance();
      let data;
      try {
        const response = await fetch(query_url + '/user/' + PULSEPOT.userInfo.account, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        data = await response.json();
        if (data.error) {
          return;
        }
        if (!data.error) {
          SETPULSEPOT((prevState) => ({
            ...prevState,
            userInfo: {
              ...prevState.userInfo,
              ['p_phase' + REACT_APP_PLSP]: data.userPlsp || 0,
              referrerEarnings: data.referrerEarnings || 0,
              code: data.referrerCode,
              act_ref_users: data.activeReferreredUsers || 0,
            },
          }));
        }
      } catch (error) {
        console.log('There was an error connecting to network');
        console.log(error);
      }
      referUser();
    };
    const referUser = async () => {
      let ref_code = window.location.href.split('/r/')[1];
      if (ref_code && ref_code.length === 5) {
        let data;
        try {
          const response = await fetch(query_url + '/r/' + ref_code + '/' + PULSEPOT.userInfo.account, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          data = await response.json();

          if (!data.error) {
          }
        } catch (error) {
          // alert('There was an error connecting to network');
          console.log(error);
        }
      }
    };
    setTimeout(() => {
      getUserInfo();
    }, 2000);
  }, [PULSEPOT.userInfo.account]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <App
                page={page}
                setPage={setPage}
                potAddress={pot_contract_address}
                isDarkMode={isDarkMode}
                setDarkMode={setDarkMode}
                PULSEPOT={PULSEPOT}
                connectWallet={connectWallet}
                setShowToken={setShowToken}
                showToken={showToken}
                setShowChain={setShowChain}
                showChain={showChain}
                setShowMenu={setShowMenu}
                showMenu={showMenu}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
