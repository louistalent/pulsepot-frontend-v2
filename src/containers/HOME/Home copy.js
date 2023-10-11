import React, { useEffect, useRef, useState } from 'react';
import './home.css';
import UserCPI from '../../components/UserCPI/UserCPI';
import Wheel from '../../components/Wheel/Wheel';
import TokenIP from '../../components/tokeninpot/TokenIP';
import Enter from '../../components/Enter/Enter';
import PotActivityChatContainer from '../../components/PotActivityChatContainer';
import Web3 from 'web3';
import PotAbi from '../../abis/pot.json';

require('dotenv').config();
var currentRoundHash = [],
  winnersRound = []; //this is used to detect duplicate events
var timeidle = 0,
  isHidden = false;

// const start_from_block = 23050621//23058101//process.env.REACT_APP_START_FROM_BLOCK
const REACT_APP_PLSP = process.env.REACT_APP_PLSP;
const REACT_APP_P_PHASE_INITIAL_BONUS = process.env.REACT_APP_P_PHASE_INITIAL_BONUS;
const REACT_APP_P_PHASE_BONUS_DIVISION = process.env.REACT_APP_P_PHASE_BONUS_DIVISION;
const spinFor = 16; //, readAfter = 5000 spinAfter = 2000,
const query_url = process.env.REACT_APP_QUERY_URL;

const providerList = [
  'https://bsc-dataseed1.binance.org/',
  'https://bsc-dataseed2.binance.org/',
  'https://bsc-dataseed3.binance.org/',
  'https://bsc-dataseed4.binance.org/',
  'https://bsc-dataseed1.defibit.io/',
  'https://bsc-dataseed2.defibit.io/',
  'https://bsc-dataseed3.defibit.io/',
  'https://bsc-dataseed4.defibit.io/',
];
const index = Math.floor(Math.random() * providerList.length) % providerList.length;
let providerUrl = providerList[index];

let provider = new Web3.providers.HttpProvider(providerUrl, {
  keepAlive: true,
  timeout: 6000,
});
const web3 = new Web3(provider);

export default function Home(props) {
  const [PotInfo, setPotInfo] = useState({
    entries: [],
    winners: [],
    participants: {
      addresses: [],
      usdValue: [],
    },
    tokensInPot: {
      names: [],
      values: [],
      usdvalues: [],
    },
    TokenInPot: {
      values: {},
      usdvalues: {},
    },
    currentRoundTotalUsd: 0,
    round: 0,
    duration: 300,
    startTimer: true,
  });
  const [BNBPPrice, SetBNBPPrice] = useState(1);

  const [isSpinning, setSpinning] = useState(false);
  const currentRoundRef = useRef(0);
  const winnerSeenRef = useRef(false);
  const potInfoRef = useRef(PotInfo);
  const failedCountRef = useRef(0);
  function spinWheel(winningAngle) {
    setSpinning(true);
    let wheel = document.getElementById('wheel');
    if (!wheel) {
      return;
    }
    let SpinningFor = 10 * 360 + parseFloat(winningAngle);
    wheel.style.WebkitTransitionDuration = spinFor + 's';
    wheel.style.easing = 'linear';

    wheel.style.transform = 'rotate(' + SpinningFor + 'deg)';
  }

  function getWinningAngle(winner, addresses, usdValue, totalUsdValue) {
    //
    let winnerAngle = 0;
    const totalValue = Number(totalUsdValue);

    for (let index = 0; index < addresses.length; index++) {
      const value = Number(usdValue[index]);
      winnerAngle += (value * 360) / totalValue;
      if (winner.toLowerCase() === addresses[index].toLowerCase()) {
        const delta = Math.random() * (value - 1) + 0.1;

        winnerAngle -= (delta * 360) / totalValue;
        break;
      }
    }

    return winnerAngle * -1;
  }

  async function getPastroundInfo(from, round) {
    ////
    let winners, entries;
    try {
      const response = await fetch(query_url + '/winners/' + parseInt(from - round) + '/' + from, {
        method: 'POST',
        headers: {
          Accepted: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      winners = await response.json();
      //
      if (winners.error) {
        //
        return;
      } else {
        try {
          const response = await fetch(query_url + '/entries/ ' + parseInt(from - round) + '/' + from, {
            method: 'POST',
            headers: {
              Accepted: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          entries = await response.json();
          //
          if (entries.error) {
            return;
          } else {
            currentRoundHash = entries.entries.map((entry) => entry.count);
            winnersRound = winners.winners.map((winner) => winner.round);
            setPotInfo((prevState) => ({
              ...prevState,
              entries: prevState.entries.concat(
                entries.entries.filter((entry, index, array) => {
                  return (
                    prevState.entries.map((entry_) => entry_.count).indexOf(entry.count) === -1
                    // array.indexOf(value) === index;
                  );
                })
              ),
              winners: prevState.winners.concat(
                winners.winners.filter((entry, index, array) => {
                  return (
                    prevState.winners.map((entry_) => entry_.round).indexOf(entry.round) === -1
                    // array.indexOf(value) === index;
                  );
                })
              ),
              // "winners": prevState.winners.concat(winners.winners),
              round: parseInt(from), //+ 1
            }));
          }
        } catch (error) {
          console.log('There was an error getting past round: ', error);
        }
      }
    } catch (error) {
      console.log('There was an error getting past round: ', error);
    }
  }

  function storeEntries(results) {
    if (results.length === 0 || !results) {
      return;
    }
    for (let index = 0; index < results.length; index++) {
      if (!currentRoundHash.includes(Number(results[index].returnValues.enteryCount))) {
        currentRoundHash.push(Number(results[index].returnValues.enteryCount));
        setPotInfo((prevState) => ({
          ...prevState,
          entries:
            prevState.entries.length === 0
              ? [
                {
                  count: parseInt(results[index].returnValues.enteryCount),
                  round: parseInt(results[index].returnValues.potRound),
                  address: results[index].returnValues.userAddress,
                  token: results[index].returnValues.tokenName,
                  value: results[index].returnValues.amount,
                  usdvalue: parseInt(results[index].returnValues.usdValue),
                  txHash: results[index].transactionHash,
                  block: results[index].blockNumber,
                },
              ]
              : prevState.entries.concat({
                count: parseInt(results[index].returnValues.enteryCount),
                round: parseInt(results[index].returnValues.potRound),
                address: results[index].returnValues.userAddress,
                token: results[index].returnValues.tokenName,
                value: results[index].returnValues.amount,
                usdvalue: parseInt(results[index].returnValues.usdValue),
                txHash: results[index].transactionHash,
                block: results[index].blockNumber,
              }),
          TokenInPot: {
            ...prevState.TokenInPot,
            values: {
              ...prevState.TokenInPot.values,
              [results[index].returnValues.tokenName]: prevState.TokenInPot.values[results[index].returnValues.tokenName] !== undefined ? prevState.TokenInPot.values[results[index].returnValues.tokenName] + results[index].returnValues.amount : results[index].returnValues.amount
            },
            usdvalues: {
              ...prevState.TokenInPot.usdvalues,
              [results[index].returnValues.tokenName]: prevState.TokenInPot.usdvalues[results[index].returnValues.tokenName] !== undefined ? prevState.TokenInPot.usdvalues[results[index].returnValues.tokenName] + results[index].returnValues.usdValue : results[index].returnValues.usdValue
            },
          },
        }));
      }
    }
  }

  function storeWinners(winners) {
    if (winners.length === 0) {
      return;
    }
    if (winnerSeenRef.current) {
      return;
    }
    let index = 0;
    let SpinAngle = getWinningAngle(
      winners[index].returnValues.winner,
      potInfoRef.current.participants.addresses,
      potInfoRef.current.participants.usdValue,
      potInfoRef.current.currentRoundTotalUsd
    );
    if (!isHidden) {
      spinWheel(SpinAngle);
    }
    setTimeout(
      () => {
        if (!winnersRound.includes(parseInt(winners[index].returnValues.potRound))) {
          winnersRound.push(parseInt(winners[index].returnValues.potRound));
          setPotInfo((prevState) => ({
            ...prevState,
            winners: prevState.winners.concat({
              amount: winners[index].returnValues.amount,
              amountwon: winners[index].returnValues.amountWon,
              block: winners[index].blockNumber,
              participant: winners[index].returnValues.participants,
              plspbonus: parseFloat(
                REACT_APP_P_PHASE_INITIAL_BONUS +
                parseFloat(parseFloat(winners[index].returnValues.value) / REACT_APP_P_PHASE_BONUS_DIVISION)
              ),
              round: parseInt(winners[index].returnValues.potRound),
              txHash: winners[index].transactionHash,
              value: winners[index].returnValues.potValue,
              winner: winners[index].returnValues.winner.toLowerCase(),
            }),
            participants: {
              addresses: [],
              usdValue: [],
            },
            currentRoundTotalUsd: 0,
            round: Number(prevState.round) + 1,
            duration: 300,
            startTimer: true,
          }));
          winnerSeenRef.current = false;
          setSpinning(false);
        }
      },
      isHidden ? 2000 : spinFor * 1000 + 2000
    );

    // }
  }

  const updateWinner = async () => {
    if (isSpinning) {
      console.log('Spinning...');
      return;
    }
    const potContractAddr = process.env.REACT_APP_POT_CONTRACT_ADDRESS;
    const PotContract = new web3.eth.Contract(PotAbi, potContractAddr);
    try {
      if (currentRoundRef.current) {
        const block = await web3.eth.getBlockNumber();
        const winners = await PotContract.getPastEvents('CalculateWinner', {
          filter: { potRound: Number(currentRoundRef.current) },
          fromBlock: parseInt(block) - 100,
        });
        console.log('winner currentRound: ', currentRoundRef.current);
        if (winners.length && !winnersRound.includes(parseInt(winners[0].returnValues.potRound))) {
          console.log({ winners });
          storeWinners(winners);
          winnerSeenRef.current = true;
        }
      }
    } catch (error) {
      console.log('error in updateWinners', error);
    }
  };

  const updateEntries = async () => {
    if (isSpinning) {
      console.log('Spinning...');
      return;
    }
    const potContractAddr = process.env.REACT_APP_POT_CONTRACT_ADDRESS;
    const PotContract = new web3.eth.Contract(PotAbi, potContractAddr);

    try {
      if (currentRoundRef.current) {
        const block = await web3.eth.getBlockNumber();
        const entries = await PotContract.getPastEvents('EnteredPot', {
          filter: { potRound: Number(currentRoundRef.current) },
          fromBlock: Number(block) - 100,
        });
        console.log('entry currentRound: ', currentRoundRef.current);
        storeEntries(entries);
        failedCountRef.current = 0;
        setTimeout(() => updateWinner(), 1000);
      }
    } catch (error) {
      console.log('error in updateEntries', error);
      failedCountRef.current++;
      if (failedCountRef.current > 4) {
        while (true) {
          const index = Math.floor(Math.random() * providerList.length) % providerList.length;
          if (providerUrl != providerList[index]) {
            console.log(providerUrl, providerList[index]);
            providerUrl = providerList[index];
            break;
          }
        }
      }
    }
  };

  useEffect(() => {
    currentRoundRef.current = PotInfo.round;
  }, [PotInfo.round]);

  useEffect(() => {
    potInfoRef.current = PotInfo;
  }, [PotInfo]);

  useEffect(() => {

    setInterval(() => {
      setPotInfo((prevState) => {
        console.log("THIS IS THE PREVIOUS STATE: ", prevState)
        return prevState
      })
    }, 30000);
    const getPrice = async () => {
      try {
        let data;
        const response = await fetch(
          'https://api.dexscreener.com/latest/dex/tokens/' + '0x4D9927a8Dc4432B93445dA94E4084D292438931F',
          {}
        );
        data = await response.json();
        SetBNBPPrice(data.pairs[0].priceUsd);
      } catch (error) {
        console.log('Failed to fetch: ', error);
      }
    };
    getPrice();
    const getInfo = () => {
      // return
      if (window.PotContract) {
        try {
          window.PotContract.methods
            .potCount()
            .call()
            .then((potCount) => {
              console.warn('This is the current round: ', potCount);
              // potCount -= 1// to be removed or edited later-----
              getPastroundInfo(parseInt(potCount), potCount > 10 ? 10 : potCount);
            })
            .catch((error) => {
              console.log('There was an error inside  getInfo');
              console.log(error);
            });
        } catch (error) {
          console.log('There was an error getting pot info');
          console.log(error);
        }
      } else {
        console.log('Not ready');
      }
    };
    try {
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          timeidle = Date.now();
          isHidden = true;
        } else {
          isHidden = false;
          if (Date.now() - timeidle > 60000) {
            getInfo();
          }
        }
      });
      setTimeout(() => {
        getInfo();
      }, 1000);
    } catch (error) {
      console.log('THERE WAS: ', error);
    }
    const entryInterval = setInterval(() => updateEntries(), 5000);

    return () => {
      clearInterval(entryInterval);
    };
  }, []);

  // useEffect(() => {
  //   const providerTimer = setInterval(() => {
  //     provider.disconnect();

  //     provider = new Web3.providers.HttpProvider(providerUrl, {
  //       keepAlive: true,
  //       timeout: 6000,
  //     });
  //     web3.setProvider(provider);
  //   }, 10000);

  //   return () => {
  //     clearInterval(providerTimer);
  //   };
  // }, []);
  useEffect(() => {
    //The current entry is prevState.entries.filter((entry) => entry.round === prevState.round)
    try {
      setPotInfo((prevState) => ({
        ...prevState,
        currentRoundTotalUsd:
          prevState.entries.filter((entry) => entry.round === prevState.round).length > 0
            ? prevState.entries
              .filter((entry) => entry.round === prevState.round)
              .map((entry) => entry.usdvalue)
              .reduce((total, usdvalue) => {
                return parseInt(total) + parseInt(usdvalue);
              }, 0)
            : 0,
        participants: {
          addresses:
            prevState.entries.filter((entry) => entry.round === prevState.round).length < 1
              ? []
              : prevState.entries
                .filter((entry) => entry.round === prevState.round)
                .map((entry) => {
                  return entry.address.toLowerCase();
                })
                .filter(function (value, index, array) {
                  return array.indexOf(value) === index;
                }),
          usdValue:
            prevState.entries.filter((entry) => entry.round === prevState.round).length < 1
              ? []
              : prevState.entries
                .filter((entry) => entry.round === prevState.round)
                .map((entry) => {
                  return entry.address;
                })
                .filter(function (value, index, array) {
                  return array.indexOf(value) === index;
                })
                .map((address) =>
                  prevState.entries
                    .filter((entry) => entry.round === prevState.round)
                    .filter((entry) => entry.address === address)
                    .reduce((total, entry_) => {
                      return parseInt(total.usdvalue ? total.usdvalue : total) + parseInt(entry_.usdvalue);
                    }, 0)
                ),
        },

        TokenInPot: {
          values: {},
          usdvalues: {},
        },
        tokensInPot: {
          names: prevState.entries
            .filter((entry) => entry.round === prevState.round)
            .map((entry) => entry.token)
            .filter(function (value, index, array) {
              return array.indexOf(value) === index;
            })
          // .sort()
          ,
          values: prevState.entries
            .filter((entry) => entry.round === prevState.round)
            .map((entry) => entry.token)
            .filter(function (value, index, array) {
              return array.indexOf(value) === index;
            })
            .map((name) =>
              prevState.entries
                .filter((entry) => entry.round === prevState.round)
                .filter((entry) => entry.token === name)
                .reduce((total, entry_) => {
                  return parseInt(total.value ? total.value : total) + parseInt(entry_.value);
                }, 0)
            ),
          usdvalues: prevState.entries
            .filter((entry) => entry.round === prevState.round)
            .map((entry) => entry.token)
            .filter(function (usdvalue, index, array) {
              return array.indexOf(usdvalue) === index;
            })
            .map((name) =>
              prevState.entries
                .filter((entry) => entry.round === prevState.round)
                .filter((entry) => entry.token === name)
                .reduce((total, entry_) => {
                  return parseInt(total.usdvalue ? total.usdvalue : total) + parseInt(entry_.usdvalue);
                }, 0)
            ).sort((val1, val2) => { return val1 - val2 }),
        },
      }));
    } catch (error) {
      console.log(error);
    }
    setPotInfo((prevState) => {
      return prevState;
    });
  }, [PotInfo.entries, PotInfo.round]);

  return (
    <div className="Home">
      <div className="Home_content1">
        <div>
          <UserCPI
            account={props.PULSEPOT.userInfo.account}
            potRound={PotInfo.round}
            userTotalusd={
              PotInfo.participants.usdValue.filter(
                (value, index) =>
                  index === PotInfo.participants.addresses.indexOf(props.PULSEPOT.userInfo.account.toLowerCase())
              )[0]
            }
            potTotalUsdValue={PotInfo.currentRoundTotalUsd}
          />
        </div>
        <div>
          <Wheel
            setPotInfo={setPotInfo}
            PotInfo={PotInfo}
            isSpinning={isSpinning}
            listenToCalculatewinner={updateEntries}
            APP_PLSP={props.PULSEPOT[REACT_APP_PLSP]}
            duration={300}
            timeDiff={0}
            isDarkMode={props.isDarkMode}
          />
        </div>
        <div className="tokensInPOT">
          {PotInfo.tokensInPot.names.map((token, index) => {
            return (
              <TokenIP
                name={token}
                value={PotInfo.tokensInPot.values[index]}
                key={index}
                usdvalue={PotInfo.tokensInPot.usdvalues[index]}
                tokens={props.PULSEPOT.tokens}
              />
            );
          })}
        </div>
      </div>
      <div className="enterPot-activity">
        <div className="mobile_none">
          <Enter
            setShowToken={props.setShowToken}
            showToken={props.showToken}
            potAddress={props.potAddress}
            account={props.PULSEPOT.userInfo.account}
            connectWallet={props.connectWallet}
            tokens={props.PULSEPOT.tokens}
          />
        </div>
        <PotActivityChatContainer PotInfo={PotInfo} PULSEPOT={props.PULSEPOT} BNBPPrice={BNBPPrice} />
      </div>
    </div>
  );
}
