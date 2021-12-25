import React from 'react';
import PropTypes from 'prop-types';

export default function Form({onSubmit, currentUser}) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset" style={{display: 'flex', flexDirection: 'column'}}>
        <p>Hey <b>{currentUser.accountId}</b> 👋 Mint your random image NFT 🔥</p>
        <div style={{flexDirection: 'row'}}>
          <p className="highlight">
            <label htmlFor="title">Title:</label>
            <input
              autoComplete="off"
              autoFocus
              id="title"
              required
            />
          </p>
          <p className="highlight">
            <label htmlFor="description">Description:</label>
            <input
              autoComplete="off"
              autoFocus
              id="description"
            />
          </p>
        </div>
        <button type="submit" style={{margin: '0 10rem'}}>
          Mint Random Image NFT 🔥
        </button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
