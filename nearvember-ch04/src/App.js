import 'regenerator-runtime/runtime';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import Messages from './components/Messages';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({contract, currentUser, nearConfig, wallet}) => {
  const [messages, setMessages] = useState([]);
  const [alreadyDonated, setAlreadyDonated] = useState(false);

  if (currentUser) {
    useEffect(() => {
      contract.getMessages().then(setMessages);
    }, []);
    useEffect(() => {
      contract.hasAlreadyDonated({senderAccount: currentUser.accountId}).then(setAlreadyDonated);
    }, []);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const {fieldset, message, donation} = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    contract.addMessage(
      {text: message.value},
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getMessages().then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        message.focus();
      });
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'Donations Leaderboard 🏆'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <h1>Donations Leaderboard 🏆</h1>
        {currentUser
          ? <button onClick={signOut}>Sign out</button>
          : <button onClick={signIn}>Sign in</button>
        }
      </header>
      {!!currentUser && <Form onSubmit={onSubmit} currentUser={currentUser} alreadyDonated={alreadyDonated}/>}
      {!!currentUser && !!messages.length && <Messages messages={messages}/>}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired,
    hasAlreadyDonated: PropTypes.func.isRequired
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
