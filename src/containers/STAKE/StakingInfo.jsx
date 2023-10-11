import React from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import { Container, Row, Col } from 'react-awesome-styled-grid';
import { StakingInfoWrapper, InfoText, InfoText2 } from './style';
import { getDay, getHour, getTimeLeft } from './utils';
import logo from '../../assets/images/bnbp-icon.png';
import { useState } from 'react';

const cutPrecision = (value, precision) => {
  const str = value.toString();
  const dotIndex = str.indexOf('.');
  if (dotIndex == -1) {
    return str;
  }
  return str.slice(0, dotIndex + precision + 1);
};
const StakingInfo = (props) => {
  const { airdropPool, nextAirdropTime, totalStaking, currentStaking, totalBalance, balance, isDarkMode } = props;
  const [timeLeft, setTimeLeft] = useState('00:00:00:00');
  setInterval(() => {
    setTimeLeft(getTimeLeft(nextAirdropTime));
    // setTimeLeft(getTimeLeft(new Date('2022-10-20').getTime() / 1000));
  }, 1000);

  return (
    <StakingInfoWrapper isDarkMode={isDarkMode}>
      <Container>
        <div className="staking-info">
          <Row className="stkaing-info-row">
            <Col sm={2} md={3} lg={4} className="text-left mb-2 stkaing-info-col">
              <div className="mb-2">
                <InfoText>
                  Airdrop Reward{' '}
                  {((Number(ethers.utils.formatEther(airdropPool)) * currentStaking) / totalStaking || 0).toFixed(2)}
                  <img style={{ marginLeft: '1px', transform: 'translateY(3px)' }} src={logo} width={20} />
                </InfoText>
              </div>
              <div>
                <InfoText>Time Left: ({timeLeft})</InfoText>
              </div>
            </Col>
            <Col sm={2} md={2} offset={{ lg: 0, md: 0, sm: 1 }} lg={4} className="text-center mb-2 stkaing-info-col">
              <div className="mb-2">
                <InfoText>
                  Your Stake {totalStaking === 0 ? 0 : Number((currentStaking / totalStaking) * 100).toFixed(2)}%
                </InfoText>
              </div>
              <div>
                <InfoText>
                  Global Stake: {totalBalance === 0 ? 0 : ((totalStaking / totalBalance) * 100).toFixed(2)}%
                </InfoText>
              </div>
            </Col>
            <Col sm={2} md={3} offset={{ lg: 0, md: 0, sm: 1 }} lg={4} className="text-right">
              <div className="mb-2">
                <InfoText>Staked {cutPrecision(Number(currentStaking), 2)} BNBP</InfoText>
              </div>
              <div>
                <InfoText>Available {cutPrecision(Number(balance - currentStaking), 2)} BNBP</InfoText>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </StakingInfoWrapper>
  );
};

StakingInfo.propTypes = {
  airdropPool: PropTypes.any,
  nextAirdropTime: PropTypes.any,
  totalStaking: PropTypes.number,
  currentStaking: PropTypes.number,
  totalBalance: PropTypes.number,
  balance: PropTypes.number,
};

export default StakingInfo;
