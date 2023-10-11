import React, { useEffect, useState } from 'react';
import './home.css';
import UserCPI from '../../components/UserCPI/UserCPI';
import Wheel from '../../components/Wheel/Wheel';
import TokenIP from '../../components/tokeninpot/TokenIP';
import Enter from '../../components/Enter/Enter';
import PreviousPot from '../PreviousPot/PreviousPot';
import CurrentPot from '../currentpot/CurrentPot';
import PotActivityChatContainer from '../../components/PotActivityChatContainer';

require('dotenv').config();
var currentRoundHash = [],
  winnersRound = []; //this is used to detect duplicate events
var timeidle = 0,
  isHidden = false,
  winnerSeen = false;

// const start_from_block = 23050621//23058101//process.env.REACT_APP_START_FROM_BLOCK
const REACT_APP_PLSP = process.env.REACT_APP_PLSP;
const REACT_APP_P_PHASE_INITIAL_BONUS = process.env.REACT_APP_P_PHASE_INITIAL_BONUS;
const REACT_APP_P_PHASE_BONUS_DIVISION = process.env.REACT_APP_P_PHASE_BONUS_DIVISION;
const spinFor = 16; //, readAfter = 5000 spinAfter = 2000,
const query_url = process.env.REACT_APP_QUERY_URL;

function unsubscribe(subscription) {
  try {
    subscription.unsubscribe(function (error, success) {});
  } catch (error) {}
}

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
    currentRoundTotalUsd: 0,
    round: 0,
    duration: 300,
    startTimer: false,
  });

  var potEnteredSocket, potWinnerSocket, pastPotEnteredSocket, pastPotWinnerSocket;

  function spinWheel(winningAngle) {
    // console.log("This is the winning Angle: ", winningAngle)
    let wheel = document.getElementById('wheel');
    if (!wheel) {
      return;
    }
    let SpinningFor = 10 * 360 + parseFloat(winningAngle);
    wheel.style.WebkitTransitionDuration = parseInt(spinFor) + 's';
    wheel.style.easing = 'linear';

    wheel.style.transform = 'rotate(' + SpinningFor + 'deg)';
  }

  function getWinningAngle(winner, addresses, usdValue, totalUsdValue) {
    //
    let winnerAngle = 0,
      extra = 0;
    for (let index = 0; index < addresses.length; index++) {
      winnerAngle += (parseFloat(usdValue[index]) * 359.99999) / parseFloat(totalUsdValue);
      if (winner.toLowerCase() === addresses[index]) {
        extra = (parseFloat((usdValue[index] + '').substring(0, 2)) % 10) + 0.05;
        let extra_ = (parseFloat(usdValue[index]) * 359.99999) / parseFloat(totalUsdValue) / extra;

        winnerAngle -= extra_; //(1 + (0.1 * ((extra > 0 ? extra : 1))))
        // console.log("This is the extra: ", extra)
        // console.log("This is the Winner Angle:: ", winnerAngle)
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
      if (!currentRoundHash.includes(parseInt(results[index].returnValues.enteryCount))) {
        currentRoundHash.push(parseInt(results[index].returnValues.enteryCount));
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
        }));
      }
    }
  }

  function storeWinners(winners) {
    if (winnerSeen) {
      // return
    }
    if (winners.length === 0) {
      return;
    }
    let index = 0;
    let SpinAngle = getWinningAngle(
      winners[index].returnValues.winner,
      PotInfo.participants.addresses,
      PotInfo.participants.usdValue,
      PotInfo.currentRoundTotalUsd
    );
    if (!isHidden) {
      spinWheel(SpinAngle);
    }
    setTimeout(
      () => {
        winnerSeen = false;
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
            round: parseInt(prevState.round) + 1,
            duration: 300,
            startTimer: false,
          }));
          // currentRoundHash = []
        }
      },
      isHidden ? 2000 : spinFor * 1000 + 2000
    );

    // }
  }

  const monitorPotCurrentRound = () => {
    let _round;
    try {
      window.PotContract.methods
        .potCount()
        .call()
        .then((potCount) => {
          _round = parseInt(potCount);
          setTimeout(() => {
            try {
              unsubscribe(potEnteredSocket);
              setTimeout(() => {
                potEnteredSocket = window.PotContractEvent.events
                  .EnteredPot({ filter: { potRound: _round } }, function (error, result) {
                    try {
                      if (!error || error != null) {
                        console.log({ myEvents: result });
                        storeEntries([result]);
                      } else if (error) {
                        // getInfo()
                      }
                    } catch (error) {
                      // unsubscribe(potEnteredSocket);
                    }
                  })
                  .on('error', (errrrr) => {
                    // unsubscribe(potEnteredSocket);
                    console.log('This is the error__', errrrr);
                    // monitorPotCurrentRound();
                  });
              }, 2000);
            } catch (error) {
              console.log('There was an error monitorPotCurrentRound');
              console.log(error);
            }
            try {
              //listen for old missed out entry
              unsubscribe(pastPotEnteredSocket);
              setTimeout(() => {
                window.__web3.eth.getBlockNumber((error_, block) => {
                  pastPotEnteredSocket = window.PotContractEvent.getPastEvents(
                    'EnteredPot',
                    { filter: { potRound: _round }, fromBlock: parseInt(block) - 9000, toBlock: parseInt(block) },
                    function (error, result) {
                      try {
                        if (!error || error != null) {
                          console.log({ pastEvents: result });
                          storeEntries(result);
                        } else if (error) {
                          console.log('This is the error__:', error);
                        }
                        // unsubscribe(pastPotEnteredSocket);
                      } catch (error) {
                        // unsubscribe(pastPotEnteredSocket);
                        console.log('This is the error:::::::::_', error);
                      }
                    }
                  );
                });
              }, 2000);
            } catch (error) {
              console.log('There was an error monitorPotCurrentRound:_');
              console.log(error);
            }
          }, 1000);
        });
    } catch (error) {}
  };

  const listenToCalculatewinner = () => {
    try {
      // window.PotContract.methods.potCount().call().then(
      // (potCount) => {
      try {
        unsubscribe(potWinnerSocket);
        setTimeout(() => {
          potWinnerSocket = window.PotContractEvent.events.CalculateWinner(
            { filter: { potRound: parseInt(PotInfo.round) } },
            function (error, result) {
              if (!error) {
                winnerSeen = true;
                // setTimeout(() => {
                storeWinners([result]);
                // }, 10000);
              } else {
                console.log('There was an error in listening to the calculate winner event', error);
              }
              unsubscribe(potWinnerSocket);
            }
          );
        }, 0);
      } catch (error) {
        // unsubscribe(potWinnerSocket);
      }
      try {
        //listen for previous calculate winner
        unsubscribe(pastPotWinnerSocket);
        setTimeout(() => {
          window.__web3.eth.getBlockNumber((error_, block) => {
            pastPotWinnerSocket = window.PotContractEvent.getPastEvents(
              'CalculateWinner',
              {
                filter: { potRound: parseInt(PotInfo.round) },
                fromBlock: parseInt(block) - 9000,
                toBlock: parseInt(block),
              },
              function (error, results) {
                try {
                  if (!error && results.length > 0) {
                    winnerSeen = true;
                    storeWinners(results);
                  } else if (error) {
                    console.log('This is the error__:', error);
                  }
                  // unsubscribe(pastPotWinnerSocket);
                } catch (error) {
                  // unsubscribe(pastPotWinnerSocket);
                  console.log('This is the error:::::::::_', error);
                }
              }
            );
          });
        }, 0);
      } catch (error) {
        console.log('There was an error monitorPotCurrentRound:_');
        console.log(error);
      }
      // }
      // ).catch((error) => {
      //     console.log("There was an error inside  getInfo")
      //     console.log(error)
      // })
    } catch (error) {
      console.log('There was an error getting pot info');
      console.log(error);
    }
  };



  useEffect(() => {
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
      // setInterval(() => {
      //   getInfo()
      // }, 180000);
    } catch (error) {
      console.log('THERE WAS: ', error);
    }
  }, []);

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
        tokensInPot: {
          names: prevState.entries
            .filter((entry) => entry.round === prevState.round)
            .map((entry) => entry.token)
            .filter(function (value, index, array) {
              return array.indexOf(value) === index;
            }),
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
            ),
        },
      }));
    } catch (error) {
      console.log(error);
    }
    setPotInfo((prevState) => {
      return prevState;
    });
  }, [PotInfo.entries, PotInfo.round]);

  useEffect(() => {
    monitorPotCurrentRound();
  }, [PotInfo.round]);

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
            listenToCalculatewinner={listenToCalculatewinner}
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
        <PotActivityChatContainer PotInfo={PotInfo} PULSEPOT={props.PULSEPOT} />
      </div>
    </div>
  );
}
