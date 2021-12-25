import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import BannerForm from './components/BannerForm';
import SignIn from './components/SignIn';

const App = ({contract, currentUser, nearConfig, wallet}) => {
  return (
    <main>
      <SignIn currentUser={currentUser} nearConfig={nearConfig} wallet={wallet}/>
      {!!currentUser && <BannerForm currentUser={currentUser}
                                    contract={contract}/>}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    generate_banner: PropTypes.func.isRequired
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
