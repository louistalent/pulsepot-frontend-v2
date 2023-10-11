import React from 'react';
import { useState } from 'react';
import CurrentPot from '../../containers/currentpot/CurrentPot';
import PreviousPot from '../../containers/PreviousPot/PreviousPot';
import ChatBox from '../ChatBox';
import './index.css';

const PotActivityChatContainer = (props) => {
  const { PotInfo, PULSEPOT } = props;
  const [activityTab, setActivityTab] = useState(true);
  return (
    <div className="card pastActivities">
      <div className="activity-header">
        <div
          onClick={() => setActivityTab(true)}
          className={activityTab ? 'activity-tab selected' : 'activity-tab not-selected'}
        >
          Activity
        </div>
        <div
          onClick={() => setActivityTab(false)}
          className={!activityTab ? 'activity-tab selected' : 'activity-tab not-selected'}
        >
          Chat
        </div>
      </div>
      {activityTab ? (
        <div className='PastActivities_list'>
          <CurrentPot
            round={PotInfo.round}
            entries={PotInfo.entries.filter((entry) => entry.round === PotInfo.round)}
          />
          {PotInfo.winners
            .sort((a, b) => {
              return parseInt(b.round) - parseInt(a.round);
            })
            .map((winner, index, winners) => {
              // return <div>
              //     {winner.winner} - {winner.round}
              // </div>
              return (
                <PreviousPot
                  tokens={PULSEPOT.tokens}
                  winner={winner}
                  entries={PotInfo.entries.filter((entry) => entry.round === winner.round)}
                  key={index}
                  BNBPPrice={props.BNBPPrice}
                />
              );
            })}
        </div>
      ) : (
        <ChatBox PULSEPOT={PULSEPOT} />
      )}
    </div>
  );
};

export default PotActivityChatContainer;
