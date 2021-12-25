import React from 'react';
import PropTypes from 'prop-types';
import Big from "big.js";

export default function Messages({messages}) {
  console.log(messages);

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <h2>Leaderboard (Top 50) 🔥</h2>
        {messages.map((message, i) =>
          <div key={i} style={{display: 'flex', flexDirection: 'column', width: '70%'}}>
            <span style={{
              fontWeight: 'bold',
              ...(message.premium && {color: 'red'})
            }}>#{i + 1}. {message.sender} {message.premium && '[Premium Supporter 😎]'}
            </span>
            <span>💸 Amount: {Big(message.depositAmount || '0').div(10 ** 24).toFixed()} Ⓝ</span>
            <span>🗒 Note: {message.text}</span>
            <span>🕙 Timestamp – {new Date(message.blockTimestamp / 1000000).toUTCString()}</span>
          </div>
        )}
      </div>
    </>
  );
}

Messages.propTypes = {
  messages: PropTypes.array
};
