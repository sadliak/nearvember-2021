import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import Form from './components/Form';

const App = ({contract, currentUser, nearConfig, wallet}) => {
  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NEARvana Token 🤘'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <h1>NEARvana Token 🤘</h1>
        {currentUser
          ? <button onClick={signOut}>Sign out</button>
          : <button onClick={signIn}>Sign in</button>
        }
      </header>
      {!!currentUser && <Form currentUser={currentUser}
                              nearConfig={nearConfig}
                              contract={contract}/>}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    ft_balance_of: PropTypes.func.isRequired,
    storage_deposit: PropTypes.func.isRequired,
    ft_transfer: PropTypes.func.isRequired
  }).isRequired,
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

export default App;
