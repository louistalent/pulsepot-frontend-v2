import React, { useRef, useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineSetting } from 'react-icons/ai';
import { TbRefresh } from 'react-icons/tb';
import { BsChevronDown } from 'react-icons/bs';
import { PancakeswapPair, PancakeswapPairSettings } from 'kyo-pancakeswap-auto-router-sdk';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import Web3 from 'web3';

import UniswapContract from '../../abis/uniswap_v2.json';
import erc20Abi from '../../abis/erc20.json';

import TxLoading from '../../components/buy/TxLoading';

import { AiOutlineBgColors } from 'react-icons/ai';
import { TbArrowsDownUp } from 'react-icons/tb';

import BNBP from '../../assets/images/buy/bnbp.png';
import loading from '../../assets/images/buy/loading-transparent.svg';
import balanceLoading from '../../assets/images/buy/loading.gif';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import './swap.css';

const supportedChianId = process.env.REACT_APP_CHAIN_ID;

const USDT_address = '0x55d398326f99059fF775485246999027B3197955'; // Binance USDT
const WETH_address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const BNBP_address = '0x4D9927a8Dc4432B93445dA94E4084D292438931F'; //Drip Token

const PayTokenList = [
  {
    name: 'BNB',
    description: 'Binance Chain Native Token',
    icon: 'bnb',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  {
    name: 'WBNB',
    description: 'Wrapped BNB',
    icon: 'bnb',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  {
    name: 'BUSD',
    description: 'BUSD Token',
    icon: 'busd',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  },
  {
    name: 'CAKE',
    description: 'Pancakeswap Token',
    icon: 'cake',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  },
  {
    name: 'USDT',
    description: 'Tether USD',
    icon: 'usdt',
    address: '0x55d398326f99059fF775485246999027B3197955',
  },
  {
    name: 'ETH',
    description: 'Ethereum Token',
    icon: 'eth',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  },
  {
    name: 'USDC',
    description: 'Binance Pegged USD Coin',
    icon: 'usdc',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  {
    name: 'DRIP',
    description: 'DRIP Network',
    icon: 'drip',
    address: '0x20f663CEa80FaCE82ACDFA3aAE6862d246cE0333',
  },
  {
    name: 'BTCB',
    description: 'BTCB Token',
    icon: 'btcb',
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  },
  {
    name: 'ZIL',
    description: 'Zilliqa',
    icon: 'zil',
    address: '0xb86AbCb37C3A4B64f74f59301AFF131a1BEcC787',
  },
  {
    name: 'DOGE',
    description: 'Dogecoin',
    icon: 'doge',
    address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
  },
  {
    name: 'SHIB',
    description: 'SHIBA INU',
    icon: 'shib',
    address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
  },
  {
    name: 'BABYDOGE',
    description: 'Baby Doge Coin',
    icon: 'babydoge',
    address: '0xc748673057861a797275CD8A068AbB95A902e8de',
  },
];

const toFloat = (val, unit = 18) => {
  return Number.parseFloat(ethers.utils.formatUnits(val, unit));
};

const smartPrecision = (val, maxPrecision = 6) => {
  if (!Number.parseFloat(val)) {
    return val;
  }

  for (let i = 0; i <= maxPrecision; i++) {
    if (val == val.toFixed(i)) {
      return val.toFixed(i);
    }
  }
  return val.toFixed(maxPrecision);
};

const isSameToken = (token1, token2) => {
  return token1.address == token2.address && token1.name == token2.name;
};

const SwapSettingModal = ({ setSwapSettingModal, setSlippage, slippage }) => {
  return (
    <>
      <div className="buy-container modal_">
        <div className="swap-setting-modal-container">
          <div className="swap-setting-modal-bg" onClick={() => setSwapSettingModal(false)}></div>
          <div className="swap-setting-modal-body">
            <div className="setting-header">
              <div className="">
                <h3 className="">Settings</h3>
              </div>
              <div className="">
                <AiOutlineClose
                  onClick={() => setSwapSettingModal(false)}
                  className="cursor-pointer text-lg text-[#d9ab0d]"
                />
              </div>
            </div>
            <div className="p-8 pt-2 w-full">
              <div className="mt-2 mb-4 w-full flex justify-start">
                <h4 className="uppercase">swaps & liquidity</h4>
              </div>
              <div className="w-full flex justify-start">Slippage Tolerance ?</div>
              <div className="flex items-center gap-1 justify-between">
                <button
                  onClick={() => setSlippage(0.1)}
                  className={`slippage-btn ${slippage == 0.1 ? 'slipage_active' : ''}`}
                >
                  0.1%
                </button>
                <button
                  onClick={() => setSlippage(0.5)}
                  className={`slippage-btn ${slippage == 0.5 ? 'slipage_active' : ''}`}
                >
                  0.5%
                </button>
                <button
                  onClick={() => setSlippage(1.0)}
                  className={`slippage-btn ${slippage == 1.0 ? 'slipage_active' : ''}`}
                >
                  1%
                </button>
                <input
                  placeholder="0.50"
                  min={0}
                  max={50}
                  className={`slippage-btn ${
                    slippage !== 0.1 && slippage !== 0.5 && slippage !== 1.0 ? 'slipage_active' : ''
                  }`}
                  style={{ color: 'white', width: '70px' }}
                  type="input"
                  onChange={(e) => setSlippage(e.target.value)}
                />
                %
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SelectTokenModal = ({ loaded, balanceInfo, setTokenModal, setSelectedToken, selectedToken }) => {
  return (
    <>
      <div className="buy-container modal_">
        <div className="swap-setting-modal-container">
          <div className="swap-setting-modal-bg" onClick={() => setTokenModal(false)}></div>
          <div className="swap-setting-modal-body max-w-400">
            <div className="setting-header token-header">
              <div className="">
                <h3 className="">Select a Token</h3>
              </div>
              <div className="">
                <AiOutlineClose
                  onClick={() => setTokenModal(false)}
                  className="cursor-pointer text-lg text-[#d9ab0d]"
                />
              </div>
            </div>
            <div className="p-8 pt-2 w-full token-item-list">
              {PayTokenList.map((token, index) => (
                <div
                  key={index}
                  className={`token-item ${isSameToken(token, selectedToken) ? 'selected' : ''}`}
                  onClick={() => {
                    if (!isSameToken(token, selectedToken)) {
                      setSelectedToken(token);
                      setTokenModal(false);
                    }
                  }}
                >
                  <img
                    width={'30px'}
                    height={'30px'}
                    className="token-img"
                    src={`/assets/buy/${token.icon}.png`}
                    alt={token.name}
                  />
                  <div className="token-title-container">
                    <div className="token-symbol">{token.name}</div>
                    <div className="token-description">{token.description}</div>
                  </div>
                  <div className="token-balance">
                    {!loaded[token.name] ? (
                      <img width={'20px'} height={'20px'} src={balanceLoading} alt="loading" />
                    ) : (
                      balanceInfo[token.name]
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Buy = ({ PULSEPOT }) => {
  // const web3 = window.__web3;
  const web3 = new Web3('https://bsc-dataseed1.binance.org');
  const account = PULSEPOT.userInfo.account;
  const swalBackground = '#343544';
  const swalColor = 'white';
  const swalCancelBtnColor = '#e72c2c';

  const [currentSellToken, setCurrentSellToken] = useState(WETH_address);
  const [currentBuyToken, setCurrentBuyToken] = useState(BNBP_address);
  const currentSellTokenRef = useRef(WETH_address);
  const currentBuyTokenRef = useRef(BNBP_address);

  const [selectTokenModal, setSelectTokenModal] = useState(false);
  const [swapSettingModal, setSwapSettingModal] = useState(false);
  const [isConnect, setIsConnect] = useState(false);

  const [sellTokenBalance, setSellTokenBalance] = useState(0);
  const [buyTokenBalance, setBuyTokenBalance] = useState(0);
  const [convertionRate, setConvertionRate] = useState(1);
  const [sellTokenPrice, setSellTokenPrice] = useState(0);
  const [buyTokenPrice, setBuyTokenPrice] = useState(0);
  const [BNBPPrice, setBNBPPrice] = useState(30);

  const [realPayValue, setRealPayValue] = useState(0);
  const [realReceiveValue, setRealReceiveValue] = useState(0);
  const [receive, setRecieveValue] = useState(0);
  const [pay, setPayValue] = useState(0);
  const payRef = useRef(0);
  const receiveRef = useRef(0);

  const [slippage, setSlippage] = useState(0.5);
  const [minimumReceiveAmount, setMinimumReceiveAmount] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);
  const [isBuySellConvert, setIsBuySellConvert] = useState(false);
  const [swapWillFail, setSwapWillFail] = useState(false);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [isBalanceLoadingPay, setIsBalanceLoadingPay] = useState(false);
  const [isBalanceLoadingReceive, setIsBalanceLoadingReceive] = useState(false);

  const [isSkelection, setIsSkelection] = useState(false);
  const [selectedToken, setSelectedToken] = useState(PayTokenList[0]);
  const [tokenBalances, setTokenBalances] = useState({});
  const [tokenBalancesLoaded, setTokenBalancesLoaded] = useState({});

  const waitTransaction = async (txHash, callback) => {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (!receipt) {
      setTimeout(() => waitTransaction(txHash, callback), 1000);
    } else {
      if (receipt.status === true) {
        callback && callback();
        return true;
      } else {
        Swal.fire({
          background: swalBackground,
          confirmButtonColor: swalCancelBtnColor,
          color: swalColor,
          title: 'Transaction Failed!',
          showCancelButton: false,
          icon: 'error',
        });
      }
    }
  };

  const updateCurrentSellToken = (value) => {
    currentSellTokenRef.current = value;
    setCurrentSellToken(value);
  };

  const updateCurrentBuyToken = (value) => {
    currentBuyTokenRef.current = value;
    setCurrentBuyToken(value);
  };

  const updatePayValue = (value) => {
    payRef.current = value;
    setPayValue(value);
  };

  const updateReceiveValue = (value) => {
    receiveRef.current = value;
    setRecieveValue(value);
  };

  const onReceiveChange = (e) => {
    let buyTokenValue = Number(e.target.value);
    updateReceiveValue(e.target.value);
    if (buyTokenValue <= 0) {
      updatePayValue(0);
      setRealPayValue(0);
      setRealReceiveValue(0);
      return;
    }
    setRealReceiveValue(buyTokenValue);
    setSwapWillFail(false);
    updateTokenPrice();
    if (web3) {
      setIsBalanceLoadingPay(true);
      getInfoForBuy(buyTokenValue);
    }
  };

  const onPayChange = async (e) => {
    let taxTokenValue = Number(e.target.value);
    updatePayValue(e.target.value);
    if (taxTokenValue <= 0) {
      setRealPayValue(0);
      updateReceiveValue(0);
      setRealReceiveValue(0);
      return;
    }
    setRealPayValue(taxTokenValue);
    setSwapWillFail(false);
    updateTokenPrice();
    if (web3) {
      setIsSkelection(true);
      setIsBalanceLoadingReceive(true);
      getInfoForSell(taxTokenValue);
    }
  };

  const setMaxBalance = () => {
    setRealPayValue(sellTokenBalance);
    updatePayValue(sellTokenBalance);
    if (web3) {
      setSwapWillFail(false);
      isBuySellConvert ? getInfoForSell(buyTokenBalance) : getInfoForSell(sellTokenBalance);
    }
  };
  const settingCall = () => {
    setSwapSettingModal(true);
  };

  const buySellConvert = () => {
    setIsBuySellConvert(!isBuySellConvert);

    const payTemp = pay;
    updatePayValue(receive);
    updateReceiveValue(payTemp);

    const realPayTemp = realPayValue;
    setRealPayValue(realReceiveValue);
    setRealReceiveValue(realPayTemp);

    const sellTokenTemp = currentSellToken;
    updateCurrentSellToken(currentBuyToken);
    updateCurrentBuyToken(sellTokenTemp);

    const sellBalanceTemp = sellTokenBalance;
    setSellTokenBalance(buyTokenBalance);
    setBuyTokenBalance(sellBalanceTemp);

    const sellTokenPriceTemp = sellTokenPrice;
    setSellTokenPrice(buyTokenPrice);
    setBuyTokenPrice(sellTokenPriceTemp);
  };

  const swapETHForTokens = async () => {
    let deadline = Date.now() + 60000000;
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: swalBackground,
      color: swalColor,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    try {
      const Uniswap = new web3.eth.Contract(UniswapContract.abi, UniswapContract.networks[supportedChianId].address);
      const sellTokenContract = new web3.eth.Contract(erc20Abi, currentSellTokenRef.current);
      const sellTokenDecimal = await sellTokenContract.methods.decimals().call();
      const buyTokenContract = new web3.eth.Contract(erc20Abi, currentBuyTokenRef.current);
      const buyTokenDecimal = await buyTokenContract.methods.decimals().call();
      const tradeInfo = await getTradeInfo(currentSellTokenRef.current, currentBuyTokenRef.current, realPayValue);

      let data;
      data = Uniswap.methods
        .swapExactETHForTokens(
          ethers.utils.parseUnits(((realReceiveValue * (100 - slippage)) / 100).toString(), buyTokenDecimal),
          tradeInfo.routePath,
          account,
          Math.round(deadline / 1000).toString()
        )
        .encodeABI();

      const transactionParameters = {
        from: account,
        to: UniswapContract.networks[supportedChianId].address,
        value: web3.utils.toHex(ethers.utils.parseUnits(realPayValue.toString(), sellTokenDecimal).toString()),
        data: data,
        chainId: web3.utils.toHex(supportedChianId),
      };

      const txHash = await window.ethereum.request(
        {
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        },
        (err, txHash) => {
          console.log(err, txHash);
          setIsTxLoading(false);
        }
      );

      await waitTransaction(txHash, () => {
        getUserBalance();
        setIsTxLoading(false);
        Toast.fire({
          icon: 'success',
          title: 'Swap Success',
        });
      });
    } catch (error) {
      console.error(error);
      console.log(error.code, error.message);
      setIsTxLoading(false);
      if (error.code == 4001) {
        Toast.fire({
          icon: 'warning',
          title: 'User cancelled transaction.',
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Swap Failed.',
        });
      }
    }
  };

  const swapCall = async () => {
    let deadline = Date.now() + 60000000;
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: swalBackground,
      color: swalColor,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    if (!isConnect) {
      return Toast.fire({
        icon: 'warning',
        title: 'Please connect wallet',
      });
    }
    if (realReceiveValue <= 0 || realPayValue <= 0) {
      return Toast.fire({
        icon: 'warning',
        title: 'Please enter amount',
      });
    }

    setIsTxLoading(true);
    const Uniswap = new web3.eth.Contract(UniswapContract.abi, UniswapContract.networks[supportedChianId].address);
    try {
      const sellTokenContract = new web3.eth.Contract(erc20Abi, currentSellToken);
      const sellTokenDecimal = await sellTokenContract.methods.decimals().call();
      const buyTokenContract = new web3.eth.Contract(erc20Abi, currentBuyToken);
      const buyTokenDecimal = await buyTokenContract.methods.decimals().call();

      // If sell token is BNB
      if (selectedToken.name == 'BNB' && currentSellToken == WETH_address) {
        swapETHForTokens();
      } else {
        const contract = new web3.eth.Contract(erc20Abi, currentSellToken);
        const approvedata = contract.methods
          .approve(
            UniswapContract.networks[supportedChianId].address,
            ethers.utils.parseUnits(realPayValue.toString(), sellTokenDecimal)
          )
          .encodeABI();
        const json = {
          from: account,
          to: currentSellToken,
          chainId: web3.utils.toHex(supportedChianId),
          data: approvedata,
        };
        const res = await window.ethereum.request(
          {
            method: 'eth_sendTransaction',
            params: [json],
          },
          (err, txHash) => {
            console.log(err, txHash);
          }
        );

        const tradeInfo = await getTradeInfo(currentSellToken, currentBuyToken, realPayValue);

        await waitTransaction(res, async () => {
          const isBuyETH = currentBuyToken == WETH_address && selectedToken.name == 'BNB';
          let data;
          if (!isBuyETH) {
            data = Uniswap.methods
              .swapExactTokensForTokens(
                ethers.utils.parseUnits(realPayValue.toString(), sellTokenDecimal),
                ethers.utils.parseUnits(((realReceiveValue * (100 - slippage)) / 100).toString(), buyTokenDecimal),
                tradeInfo.routePath,
                account,
                Math.round(deadline / 1000).toString()
              )
              .encodeABI();
          } else {
            data = Uniswap.methods
              .swapExactTokensForETH(
                ethers.utils.parseUnits(realPayValue.toString(), sellTokenDecimal),
                ethers.utils.parseUnits(((realReceiveValue * (100 - slippage)) / 100).toString(), buyTokenDecimal),
                tradeInfo.routePath,
                account,
                Math.round(deadline / 1000).toString()
              )
              .encodeABI();
          }

          const transactionParameters = {
            from: account,
            to: UniswapContract.networks[supportedChianId].address,
            data: data,
            chainId: web3.utils.toHex(supportedChianId),
          };

          const txHash = await window.ethereum.request(
            {
              method: 'eth_sendTransaction',
              params: [transactionParameters],
            },
            (err, txHash) => {
              console.log(err, txHash);
              setIsTxLoading(false);
            }
          );

          await waitTransaction(txHash, () => {
            getUserBalance();
            setIsTxLoading(false);
            Toast.fire({
              icon: 'success',
              title: 'Swap Success',
            });
          });
        });
      }
    } catch (error) {
      console.error(error);
      console.log(error.code, error.message);
      setIsTxLoading(false);
      if (error.code == 4001) {
        Toast.fire({
          icon: 'warning',
          title: 'User cancelled transaction.',
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Swap Failed.',
        });
      }
    }
  };

  const getUserBalance = async () => {
    // Get User Balance
    if (!web3 || !account) return;
    const sellTokenContract = new web3.eth.Contract(erc20Abi, currentSellTokenRef.current);
    const sellTokenDecimal = await sellTokenContract.methods.decimals().call();
    const buyTokenContract = new web3.eth.Contract(erc20Abi, currentBuyTokenRef.current);
    const buyTokenDecimal = await buyTokenContract.methods.decimals().call();

    const sellTokenBalance = toFloat(await sellTokenContract.methods.balanceOf(account).call(), sellTokenDecimal);
    const buyTokenBalance = toFloat(await buyTokenContract.methods.balanceOf(account).call(), buyTokenDecimal);

    if (selectedToken.name == 'BNB') {
      const ethBalance = toFloat(
        await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
      );

      if (currentSellTokenRef.current == WETH_address) {
        setSellTokenBalance(ethBalance);
        setBuyTokenBalance(buyTokenBalance);
      } else if (currentBuyTokenRef.current == WETH_address) {
        setSellTokenBalance(sellTokenBalance);
        setBuyTokenBalance(ethBalance);
      }
    } else {
      setSellTokenBalance(sellTokenBalance);
      setBuyTokenBalance(buyTokenBalance);
    }
  };

  const updateTokenPrice = async () => {
    const getAPI = (addr) =>
      addr == BNBP_address
        ? 'https://api.dexscreener.com/latest/dex/tokens/'
        : 'https://coins.llama.fi/prices/current/bsc:';

    const sellTokenPriceInfo = await (await fetch(getAPI(currentSellToken) + currentSellToken)).json();
    const buyTokenPriceInfo = await (await fetch(getAPI(currentBuyToken) + currentBuyToken)).json();

    let sellTokenPrice = sellTokenPriceInfo.pairs
      ? sellTokenPriceInfo.pairs[0].priceUsd
      : sellTokenPriceInfo.coins[`bsc:${currentSellToken}`].price;
    let buyTokenPrice = buyTokenPriceInfo.pairs
      ? buyTokenPriceInfo.pairs[0].priceUsd
      : buyTokenPriceInfo.coins[`bsc:${currentBuyToken}`].price;
    setSellTokenPrice(Number(sellTokenPrice));
    setBuyTokenPrice(Number(buyTokenPrice));

    if (currentSellToken == BNBP_address) {
      setBNBPPrice(Number(sellTokenPrice));
    } else {
      setBNBPPrice(Number(buyTokenPrice));
    }
  };

  const getTradeInfo = async (from, to, amount) => {
    const pancakeswapPair = new PancakeswapPair({
      // the contract address of the token you want to convert FROM
      fromTokenContractAddress: from,
      // the contract address of the token you want to convert TO
      toTokenContractAddress: to,
      // the ethereum address of the user using this part of the dApp
      ethereumAddress: '0x6043e99f5C6b7327b421f1C5E72e65266069bb62',
      settings: new PancakeswapPairSettings({
        deadlineMinutes: 20,
        disableMultihops: false,
      }),
    });

    const pancakeswapPairFactory = await pancakeswapPair.createFactory();
    const trade = await pancakeswapPairFactory.trade(amount);

    return trade;
  };
  const getInfoForSell = async (sellTokenValue) => {
    try {
      const tradeInfo = await getTradeInfo(
        currentSellTokenRef.current,
        currentBuyTokenRef.current,
        sellTokenValue.toString()
      );

      if (Number(tradeInfo.baseConvertRequest) != Number(payRef.current)) {
        console.log('wrong', payRef.current, tradeInfo.baseConvertRequest);
        setIsBalanceLoadingReceive(false);
        return;
      }
      const sellTokenContract = new web3.eth.Contract(erc20Abi, currentSellToken);
      const sellTokenDecimal = await sellTokenContract.methods.decimals().call();
      const buyTokenContract = new web3.eth.Contract(erc20Abi, currentBuyToken);
      const buyTokenDecimal = await buyTokenContract.methods.decimals().call();
      const UniswapRouterContract = new web3.eth.Contract(
        UniswapContract.abi,
        UniswapContract.networks[supportedChianId].address
      );

      const amounts = await UniswapRouterContract.methods
        .getAmountsOut(
          ethers.utils.parseUnits(sellTokenValue.toString(), sellTokenDecimal).toString(),
          tradeInfo.routePath
        )
        .call();
      const receivedValue = toFloat(amounts[amounts.length - 1], buyTokenDecimal);

      setConvertionRate(receivedValue / sellTokenValue);
      setMinimumReceiveAmount((receivedValue * (100 - slippage)) / 100);

      const priceImpact = ((receivedValue * buyTokenPrice) / (sellTokenPrice * sellTokenValue)) * 100 - 100;

      setPriceImpact(priceImpact);
      setRealReceiveValue(receivedValue);
      updateReceiveValue(smartPrecision(receivedValue, 2));
      setIsBalanceLoadingPay(false);
      setIsBalanceLoadingReceive(false);
      setIsSkelection(false);
    } catch (error) {
      console.log('getInfoForSell : ');
      console.log(error);
      setIsBalanceLoadingPay(false);
      setIsBalanceLoadingReceive(false);
      setIsSkelection(false);
      setSwapWillFail(true);
    }
  };

  const getInfoForBuy = async (buyTokenValue) => {
    const sellTokenContract = new web3.eth.Contract(erc20Abi, currentSellTokenRef.current);
    const sellTokenDecimal = await sellTokenContract.methods.decimals().call();
    const buyTokenContract = new web3.eth.Contract(erc20Abi, currentBuyTokenRef.current);
    const buyTokenDecimal = await buyTokenContract.methods.decimals().call();
    const UniswapRouterContract = new web3.eth.Contract(
      UniswapContract.abi,
      UniswapContract.networks[supportedChianId].address
    );
    try {
      const tradeInfo = await getTradeInfo(
        currentSellTokenRef.current,
        currentBuyTokenRef.current,
        buyTokenValue.toString()
      );

      if (Number(tradeInfo.baseConvertRequest) != Number(receiveRef.current)) {
        setIsBalanceLoadingPay(false);
        console.log('wrong', receiveRef.current, tradeInfo.baseConvertRequest);
        return;
      }

      const amounts = await UniswapRouterContract.methods
        .getAmountsIn(ethers.utils.parseUnits(buyTokenValue.toString(), buyTokenDecimal), tradeInfo.routePath)
        .call();
      const payValue = toFloat(amounts[0], sellTokenDecimal);

      setConvertionRate(buyTokenValue / payValue);
      setMinimumReceiveAmount((buyTokenValue * (100 - slippage)) / 100);

      const priceImpact = ((buyTokenValue * buyTokenPrice) / (sellTokenPrice * payValue)) * 100 - 100;

      setPriceImpact(priceImpact);
      setRealPayValue(payValue);
      updatePayValue(smartPrecision(payValue, 2));
      setIsBalanceLoadingPay(false);
      setIsBalanceLoadingReceive(false);
    } catch (error) {
      console.log('getInfoForBuy : ');
      console.log(error);
      setIsBalanceLoadingReceive(false);
      setIsBalanceLoadingPay(false);
      setSwapWillFail(true);
      updatePayValue(0);
      setConvertionRate(0);
      setMinimumReceiveAmount(0);
    }
  };

  const refreshData = () => {
    updateTokenPrice();
    onPayChange({ target: { value: pay } });
  };

  const checkInputKey = (e) => {
    if ((e.keyCode >= 65 && e.keyCode <= 97) || e.keyCode == 189) {
      e.preventDefault();
    }
  };

  const getTokenBalances = async () => {
    if (!account) return;
    setTokenBalancesLoaded({});
    setTokenBalances({});
    const bnbBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
    for (let i = 0; i < PayTokenList.length; i++) {
      const tokenName = PayTokenList[i].name;
      const tokenContract = new web3.eth.Contract(erc20Abi, PayTokenList[i].address);
      const tokenDecimal = await tokenContract.methods.decimals().call();
      let balance = tokenName == 'BNB' ? bnbBalance : await tokenContract.methods.balanceOf(account).call();
      setTokenBalances((prev) => ({ ...prev, [tokenName]: smartPrecision(toFloat(balance, tokenDecimal), 4) }));
      setTokenBalancesLoaded((prev) => ({ ...prev, [tokenName]: true }));
    }
  };

  useEffect(() => {
    getUserBalance();
    updateTokenPrice();
    if (account && account.length > 0) {
      setIsConnect(true);
    }
  }, [account, web3]);

  useEffect(() => {
    getUserBalance();
    updateTokenPrice();
  }, [currentSellToken, currentBuyToken]);

  return (
    <>
      {/* bg-[#1b1b1b] */}
      <div className="buy-container" style={{ color: 'rgb(197, 197, 197)' }}>
        <section className="container mx-auto flex flex-col premium-container">
          <div className=" premium-div">
            <div>
              <div className="flex justify-between items-center gap-2">
                <div className="currnet-premium">
                  <h1
                    style={{
                      color: 'white',
                      fontSize: '35px',
                      margin: '0',
                      padding: '0px',
                    }}
                  >
                    {30 > BNBPPrice ? ((30 / BNBPPrice) * 100 - 100).toFixed(0) : '10'}&nbsp;%
                  </h1>
                  <p>Current&nbsp;premium</p>
                </div>
                <div className="flex-3 flex items-center justify-end gap-3">
                  <h3 className="text-center">
                    Trade to <span style={{ color: 'white' }}>BNBP</span> and enjoy the free premium betting value!
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto flex flex-col swap-container mb-10">
          <div className="mt-6 sm:mt-16  buy-div">
            <div>
              <div className="flex justify-end items-center">
                <div className="flex-3 flex items-center justify-end gap-3" style={{ flex: 3 }}>
                  <a target={'_blank'} href={`https://pancakeswap.finance/add/${BNBP_address}`}>
                    <AiOutlineBgColors className="text-2xl cursor-pointer hover:text-yello-500" />
                  </a>
                  <TbRefresh onClick={refreshData} className="text-2xl cursor-pointer hover:text-yello-500" />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <span className="swap-title font-semibold">Swap</span>
              </div>
              <div className="mt-4">
                <div className="swap-underline"></div>
              </div>
              <div
                className={`flex items-center justify-between flex-col ${isBuySellConvert ? 'flex-col-reverse-i' : ''}`}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <p className="font-inter buy-grey-color text-sm mb-2">
                      You {!isBuySellConvert ? 'Pay' : 'Receive'}
                    </p>
                    <p className="font-inter buy-grey-color text-sm mb-2">
                      Balance : {!isBuySellConvert ? sellTokenBalance.toFixed(4) : buyTokenBalance.toFixed(4)}
                    </p>
                  </div>
                  <div
                    className={`swap-input-container ${
                      (!isBuySellConvert ? isBalanceLoadingPay : isBalanceLoadingReceive) && 'balance-loading'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="">
                          <input
                            placeholder="0.00"
                            onKeyDown={checkInputKey}
                            onChange={(e) => (!isBuySellConvert ? onPayChange(e) : onReceiveChange(e))}
                            value={!isBuySellConvert ? pay : receive}
                            className="swap-input"
                          />
                        </div>
                        <div className="">
                          $
                          {smartPrecision(
                            !isBuySellConvert
                              ? sellTokenPrice * (realPayValue || 1)
                              : buyTokenPrice * (realReceiveValue || 1),
                            2
                          )}
                          {isBuySellConvert &&
                            realPayValue &&
                            !isTxLoading &&
                            !isBalanceLoadingPay &&
                            !isBalanceLoadingReceive &&
                            ` (${smartPrecision(priceImpact, 2)}%)`}
                        </div>
                      </div>
                    </div>
                    <div className="token-list-container">
                      <div
                        onClick={() => {
                          getTokenBalances();
                          setSelectTokenModal(true);
                        }}
                        className="flex items-center justify-between gap-2"
                      >
                        <img
                          width={'30px'}
                          height={'30px'}
                          src={`/assets/buy/${selectedToken.icon}.png`}
                          alt={selectedToken.name}
                        />
                        <div className="token-list-name">{selectedToken.name}</div>
                        <div className="">
                          <BsChevronDown className="token-list-dropdown-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex justify-end">
                    <button onClick={setMaxBalance} className="swap-max-btn">
                      Max
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center justify-between m-auto">
                      <TbArrowsDownUp onClick={buySellConvert} className="buy-sell-convert-btn" />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="flex items-center justify-between">
                    <p className="font-inter buy-grey-color text-sm mb-2">You {isBuySellConvert ? 'Pay' : 'Receive'}</p>
                    <p className="font-inter buy-grey-color text-sm mb-2">
                      Balance : {isBuySellConvert ? sellTokenBalance.toFixed(4) : buyTokenBalance.toFixed(4)}
                    </p>
                  </div>
                  <div
                    className={`swap-input-container ${
                      (!isBuySellConvert ? isBalanceLoadingReceive : isBalanceLoadingPay) && 'balance-loading'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="">
                          <input
                            placeholder="0.00"
                            onKeyDown={checkInputKey}
                            onChange={(e) => (!isBuySellConvert ? onReceiveChange(e) : onPayChange(e))}
                            value={!isBuySellConvert ? receive : pay}
                            className="swap-input"
                          />
                        </div>
                        <div className="">
                          $
                          {smartPrecision(
                            !isBuySellConvert
                              ? buyTokenPrice * (realReceiveValue || 1)
                              : sellTokenPrice * (realPayValue || 1),
                            2
                          )}
                          {!isBuySellConvert &&
                            realPayValue &&
                            !isTxLoading &&
                            !isBalanceLoadingPay &&
                            !isBalanceLoadingReceive &&
                            ` (${smartPrecision(priceImpact, 2)}%)`}
                        </div>
                      </div>
                    </div>
                    <div className="show-dropdown flex items-center gap-2">
                      {
                        <>
                          <img src={BNBP} alt="error" style={{ width: '35px', height: '33px' }} />
                          &nbsp;
                          <p className="bnbp-text">BNBP</p>
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2" style={{ height: '20px' }}>
              {isTxLoading || isBalanceLoadingPay || isBalanceLoadingReceive ? (
                <>
                  <img width={'20px'} height={'20px'} src={loading} alt="loading" />
                  {isTxLoading ? <>Swapping...</> : <>Fetching best price...</>}
                </>
              ) : (
                <></>
              )}
            </div>
            {!swapWillFail &&
              !isTxLoading &&
              !isBalanceLoadingPay &&
              !isBalanceLoadingReceive &&
              realPayValue != 0 &&
              realReceiveValue != 0 && (
                <div className="px-4 flex items-center justify-between">
                  <span className="slippage-tolerance">Price </span>
                  <span>
                    {smartPrecision(realReceiveValue / realPayValue)} {!buySellConvert ? selectedToken.name : 'BNBP'}{' '}
                    per {!buySellConvert ? 'BNBP' : selectedToken.name}{' '}
                  </span>
                </div>
              )}
            <div className="px-4">
              <div className="flex items-center justify-between">
                <p className="slippage-tolerance">Slippage Tolerance</p>
                <div className="flex items-center justify-end gap-2">
                  <p className="slippage-precent">{slippage}%</p>
                  <AiOutlineSetting onClick={settingCall} className="text-2xl cursor-pointer hover:text-yello-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              {swapWillFail ? (
                <button className={`swap-btn swap-shadow`} disabled style={{ fontSize: '20px' }}>
                  Insufficient liquidity for this trade.
                </button>
              ) : isTxLoading || isBalanceLoadingPay || isBalanceLoadingReceive ? (
                <button disabled className={`swap-btn swap-shadow`}>
                  SWAP
                </button>
              ) : (
                <button onClick={swapCall} className={`swap-btn swap-shadow`}>
                  SWAP
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
      {swapSettingModal && (
        <SwapSettingModal setSwapSettingModal={setSwapSettingModal} slippage={slippage} setSlippage={setSlippage} />
      )}
      {selectTokenModal && (
        <SelectTokenModal
          loaded={tokenBalancesLoaded}
          balanceInfo={tokenBalances}
          setTokenModal={setSelectTokenModal}
          selectedToken={selectedToken}
          setSelectedToken={(token) => {
            setSelectedToken(token);
            !isBuySellConvert ? updateCurrentSellToken(token.address) : updateCurrentBuyToken(token.address);
            setTimeout(() => {
              !isBuySellConvert
                ? onPayChange({ target: { value: pay } })
                : onReceiveChange({ target: { value: receive } });
            }, 500);
          }}
        />
      )}
    </>
  );
};

Buy.propTypes = {
  PULSEPOT: PropTypes.any,
};

export default Buy;
