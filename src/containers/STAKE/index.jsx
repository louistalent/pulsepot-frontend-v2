import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress } from '@material-ui/core';
import { BigNumber, ethers } from 'ethers';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import PLSP from '../../abis/PLSP.json';
import PotLottery from '../../abis/PotLottery.json';
import {
  StakingHeader,
  StakingWrapper,
  InfoText,
  InfoText2,
  StkaingHeaderUnderline,
  CreateStakingWrapper,
  CreateStakingButton,
  StakingListWrapper,
  LoadingWrapper,
  StakingAmountInput,
} from './style';
import './stake.css';
import logo from '../../assets/images/bnbp-icon.png';
import StakingInfo from './StakingInfo';
import StakingItem from './StakingItem';

const StakingPage = ({ PULSEPOT, isDarkMode }) => {
  const web3 = window.__web3;
  const PotLotteryContract = window.PotContract;
  const PLSPContract = window.PLSPContract;
  const account = PULSEPOT.userInfo.account;
  const swalBackground = '#343544';
  const swalColor = 'white';
  const swalConfirmBtnColor = '#d9ab0d';
  const swalCancelBtnColor = '#e72c2c';

  const oneDay = 24 * 3600;
  const [stakingList, setStakingList] = useState([]);
  const [airdropPool, setAirdropPool] = useState(0);
  const [nextAirdropTime, setNextAirdropTime] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalStaking, setTotalStaking] = useState(0);
  const [totalBalance, setTotalBalance] = useState(1);
  const [currentStaking, setCurrentStaking] = useState(0);
  const [stakingTime, setStakingTime] = useState(100);
  const [stakingMinimum, setStakingMinimum] = useState(0);
  const [stakingAmount, setStakingAmount] = useState();
  const [isStaking, setIsStaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const [balanceBN, setBalanceBN] = useState(ethers.BigNumber.from(0));
  const [currentStakingBN, setCurrentStakingBN] = useState(ethers.BigNumber.from(0));
  const [realStakeBN, setRealStakingBN] = useState(ethers.BigNumber.from(0));

  const unStakingListRef = useRef([]);
  const stakingListRef = useRef([]);
  const loadingListRef = useRef(false);
  const getUnStakingList = () => unStakingListRef.current;
  const getStakingList = () => stakingListRef.current;
  const updateStakingList = (list) => {
    stakingListRef.current = list;
    setStakingList(list);
  };
  const convertToFloat = (val) => {
    return Number.parseFloat(ethers.utils.formatEther(val));
  };
  const getStakingInfo = async (update = false) => {
    if (!web3) return;
    if (update) {
      loadingListRef.current = true;
    }
    let list = [];
    let currentBalance = 0;
    let currentBalanceBN = ethers.BigNumber.from('0');
    if (account) {
      list = await PLSPContract.methods.getUserStakingInfo(account).call();
      const result = await PLSPContract.methods.balanceOf(account).call();
      currentBalanceBN = ethers.BigNumber.from(result);
      currentBalance = convertToFloat(currentBalanceBN);
    }
    const totalBalance = convertToFloat(await PLSPContract.methods.totalUserBalance().call());
    const totalStaking = convertToFloat(await PLSPContract.methods.getTotalStakingAmount().call());
    const currentStakingBN = list.reduce((total, current) => total.add(current.balance), ethers.BigNumber.from(0));
    const currentStaking = convertToFloat(currentStakingBN);
    const lastAirdropTime = await PLSPContract.methods.lastAirdropTime().call();
    const stakingMinimumTime = await PLSPContract.methods.minimumStakingTime().call();
    const stakingMinimumAmount = convertToFloat(await PLSPContract.methods.stakingMinimum().call());
    let airdropInterval = 0;
    let airdropPool = 0;
    try {
      airdropPool = await PotLotteryContract.methods.airdropPool().call();
      airdropInterval = await PotLotteryContract.methods.airdropInterval().call();
    } catch (error) {
      airdropInterval = 0;
    }

    console.log(totalBalance, totalStaking);
    updateStakingList(
      list.map((staking) => ({
        ...staking,
        balance: convertToFloat(staking.balance),
        timestamp: Number.parseInt(staking.timestamp),
      }))
    );
    setAirdropPool(airdropPool);
    setBalance(currentBalance);
    setTotalStaking(totalStaking);
    setTotalBalance(totalBalance);
    setCurrentStaking(currentStaking);
    setNextAirdropTime(Number.parseInt(lastAirdropTime) + Number.parseInt(airdropInterval));
    setStakingTime(Number.parseInt(stakingMinimumTime));
    setStakingMinimum(stakingMinimumAmount);
    setCurrentStakingBN(currentStakingBN);
    setBalanceBN(currentBalanceBN);

    if (update) {
      loadingListRef.current = false;
    }
  };

  const waitTransaction = async (txHash, callback) => {
    const receipt = await web3.eth.getTransactionReceipt(txHash);

    if (!receipt) {
      setTimeout(() => waitTransaction(txHash, callback), 1000);
    } else {
      if (receipt.status === true) {
        callback && callback();
        getStakingInfo();
      } else {
        setLoading(false);
        Swal.fire({
          background: swalBackground,
          color: swalColor,
          confirmButtonColor: swalCancelBtnColor,
          title: 'Operation Failed!',
          showCancelButton: false,
          icon: 'success',
        });
      }
    }
  };

  const unStakeItem = async (staking) => {
    try {
      const transactionParameters = {
        from: account,
        to: process.env.REACT_APP_BNBP_CONTRACT_ADDRESS,
        data: PLSPContract.methods.unStakeBNBP(staking.id).encodeABI(),
        chainId: web3.utils.toHex(process.env.REACT_APP_CHAIN_ID),
      };
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      unStakingListRef.current.push(staking.id);
      setLoading(!loading);
      waitTransaction(txHash, () => {
        unStakingListRef.current = getUnStakingList().filter((id) => id !== staking.id);
        updateStakingList(getStakingList().filter(({ id }) => id !== staking.id));
        setLoading(!loading);
        Swal.fire({
          background: swalBackground,
          confirmButtonColor: swalConfirmBtnColor,
          color: swalColor,
          title: 'Unstaking Success!',
          showCancelButton: false,
          icon: 'success',
        });
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        confirmButtonColor: swalCancelBtnColor,
        background: swalBackground,
        color: swalColor,
        title: 'Unstaking Cancelled!',
        showCancelButton: false,
        icon: 'error',
      });
    }
  };
  const stakePLSP = async () => {
    if (stakingMinimum > stakingAmount) {
      Swal.fire({
        confirmButtonColor: swalCancelBtnColor,
        background: swalBackground,
        color: swalColor,
        title: `Should stake more than minimum ${stakingMinimum} BNBP at once`,
        showCancelButton: false,
        icon: 'warning',
      });
      return;
    }

    try {
      const transactionParameters = {
        from: account,
        to: process.env.REACT_APP_BNBP_CONTRACT_ADDRESS,
        data: PLSPContract.methods.stakeBNBP(realStakeBN.toBigInt().toString()).encodeABI(),
        chainId: web3.utils.toHex(process.env.REACT_APP_CHAIN_ID),
      };
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      setIsStaking(true);
      waitTransaction(txHash, () => {
        Swal.fire({
          background: swalBackground,
          color: swalColor,
          confirmButtonColor: swalConfirmBtnColor,
          title: 'Staking Success!',
          showCancelButton: false,
          icon: 'success',
        });
        setIsStaking(false);
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Staking Cancelled!',
        background: swalBackground,
        color: swalColor,
        confirmButtonColor: swalCancelBtnColor,
        showCancelButton: false,
        icon: 'error',
      });
    }
  };
  useEffect(() => {
    getStakingInfo(true);
  }, [account]);

  return (
    <div className="swap_page">
      <StakingWrapper isDarkMode={isDarkMode}>
        <StakingHeader isDarkMode={isDarkMode}>
          <InfoText2 isDarkMode={isDarkMode} fontSize={25}>
            Staking
          </InfoText2>
          {/* <img src={PLSPImg} width="40px" alt="plsp icon"></img> */}
        </StakingHeader>
        <StkaingHeaderUnderline isDarkMode={isDarkMode} />
        <StakingInfo
          isDarkMode={isDarkMode}
          airdropPool={airdropPool}
          nextAirdropTime={nextAirdropTime}
          totalStaking={totalStaking}
          currentStaking={currentStaking}
          totalBalance={totalBalance}
          balance={balance}
        />
        <CreateStakingWrapper isDarkMode={isDarkMode}>
          <div style={{ marginTop: '20px' }}></div>
          <InfoText2 isDarkMode={isDarkMode} className="mb-4">
            CREATE NEW STAKE
          </InfoText2>
          <div style={{ marginTop: '20px' }}></div>
          <StakingAmountInput
            isDarkMode={isDarkMode}
            type="number"
            value={stakingAmount}
            placeholder={`Min ${stakingMinimum || 5} BNBP`}
            endAdornment={
              <div className="staking-input-endAdornment">
                <span
                  onClick={() => {
                    setStakingAmount(balance - currentStaking);
                    setRealStakingBN(balanceBN.sub(currentStakingBN));
                  }}
                  className="staking-max-btn"
                >
                  Max
                </span>
                <img
                  style={{ marginLeft: '2px', transform: 'translateY(4px)' }}
                  width={30}
                  src={logo}
                  alt="bnbp icon"
                />
              </div>
            }
            onChange={(e) => {
              let value = Number(e.target.value);
              setStakingAmount(e.target.value);
              setRealStakingBN(ethers.utils.parseEther(value.toString()));
            }}
          ></StakingAmountInput>
          <CreateStakingButton
            onClick={stakePLSP}
            isDarkMode={isDarkMode}
            disabled={isStaking || loadingListRef.current || !account || stakingAmount <= 0}
          >
            {isStaking && <CircularProgress className="mr-1" color="inherit" size={20} />}
            <span style={isDarkMode ? { color: 'white' } : { color: 'black' }}>
              {' '}
              STAKE {Math.floor(stakingTime / oneDay) == 0 ? '100' : Math.floor(stakingTime / oneDay)} DAYS
            </span>
            {/* <span>STAKE 100 days</span> */}
          </CreateStakingButton>
        </CreateStakingWrapper>
        <StakingListWrapper isDarkMode={isDarkMode}>
          {loadingListRef.current ? (
            <LoadingWrapper>
              <CircularProgress color="inherit" />
              <span style={{ marginLeft: '8px' }}>Loading...</span>
            </LoadingWrapper>
          ) : (
            stakingList.map((staking, index) => (
              <StakingItem
                isDarkMode={isDarkMode}
                key={index}
                item={staking}
                stakingTime={stakingTime}
                unStake={() => unStakeItem(staking)}
                loading={getUnStakingList().includes(staking.id)}
              />
            ))
          )}
        </StakingListWrapper>
      </StakingWrapper>
    </div>
  );
};

StakingPage.propTypes = {
  PULSEPOT: PropTypes.any,
  isDarkMode: PropTypes.any,
};

export default StakingPage;
