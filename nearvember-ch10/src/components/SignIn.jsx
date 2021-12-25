import React from 'react';
import PropTypes from 'prop-types';

export default function SignIn({currentUser, nearConfig, wallet}) {
  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'ASCII Banner Generator 🔤'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <header style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <h1>ASCII Banner Generator 🔤</h1>
      {currentUser
        ? <button onClick={signOut}>Sign out</button>
        : <button onClick={signIn}>Sign in</button>
      }
    </header>
  );
}

SignIn.propTypes = {
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};
