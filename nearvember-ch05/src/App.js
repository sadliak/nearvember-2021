import 'regenerator-runtime/runtime';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import Nfts from './components/Nfts';

const App = ({contract, currentUser, nearConfig, wallet}) => {
  const [nfts, setNfts] = useState([]);

  const mintNft = async (title, description) => {
    const GAS = Big(3).times(10 ** 13).toFixed();
    const PAYMENT = Big(0.1).times(10 ** 24).toFixed();

    const imageUrl = await fetch('https://picsum.photos/800/800').then(response => response.url);

    await contract.nft_mint({
        token_id: `${Math.floor(Date.now() / 1000)}`,
        receiver_id: currentUser.accountId,
        metadata: {
          title: title.value,
          description: description.value,
          media: imageUrl,
          copies: 1
        }
      },
      GAS,
      PAYMENT
    );
  };
  const getNfts = async () => {
    const nftsMap = await contract.nft_tokens_for_owner({
      account_id: currentUser.accountId,
      from_index: '0',
      limit: 50
    });

    return Object.entries(nftsMap).map(([, value]) => value);
  };

  if (currentUser) {
    useEffect(() => {
      getNfts().then(setNfts);
    }, []);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const {fieldset, title, description} = e.target.elements;
    fieldset.disabled = true;

    await mintNft(title, description);
    await getNfts();
  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      'NFT Minting Site ⛏'
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <h1>NFT Minting Site ⛏</h1>
        {currentUser
          ? <button onClick={signOut}>Sign out</button>
          : <button onClick={signIn}>Sign in</button>
        }
      </header>
      {!!currentUser && <Form onSubmit={onSubmit} currentUser={currentUser}/>}
      {!!currentUser && !!nfts.length && <Nfts nfts={nfts}/>}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    nft_mint: PropTypes.func.isRequired,
    nft_tokens_for_owner: PropTypes.func.isRequired
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
