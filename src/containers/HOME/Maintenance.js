import React from 'react';
import jackpot from '../../assets/images/jackpot-bg.png';
import './Maintenance.css';

export default function Home(props) {
  return (
    <div
      className="card Jackpot Page ComingSoonPage"
      style={{
        backgroundImage: `url(${jackpot})`,
      }}
    >
      <div className="page_title">JackPot</div>

      <div className="Page-coming-soon orange maintenance-title">Wheel Under Maintenance</div>
    </div>
  );
}
