import 'regenerator-runtime/runtime';
import React from 'react';
import PropTypes from 'prop-types';
import RegisterCandidateForm from './components/RegisterCandidateForm';
import SignIn from './components/SignIn';
import Candidates from './components/Candidates';

const App = ({contract, currentUser, nearConfig, wallet}) => {
  return (
    <main>
      <SignIn currentUser={currentUser} nearConfig={nearConfig} wallet={wallet}/>
      {!!currentUser && <RegisterCandidateForm currentUser={currentUser}
                                               contract={contract}/>}
      {!!currentUser && <Candidates currentUser={currentUser} contract={contract}/>}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    myVote: PropTypes.func.isRequired,
    stats: PropTypes.func.isRequired,
    isCandidateRegistered: PropTypes.func.isRequired,
    vote: PropTypes.func.isRequired,
    unvote: PropTypes.func.isRequired,
    registerCandidate: PropTypes.func.isRequired
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
