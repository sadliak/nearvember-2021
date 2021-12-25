import React from 'react';
import PropTypes from 'prop-types';

export default function Nfts({nfts}) {
  console.log(nfts);
  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <h2>Your NFTs 🔥</h2>
        <div style={{display: 'grid', gridTemplateColumns: '25% 25% 25% 25%', gridColumnGap: '20px'}}>
          {nfts.map((nft, i) =>
            <div key={i}
                 style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <img src={nft.metadata.media} alt={nft.metadata.title} style={{width: '70%'}}/>
              <span style={{fontWeight: 'bold', textAlign: 'center'}}>{nft.metadata.title}</span>
              <span style={{textAlign: 'center'}}>{nft.metadata.description}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Nfts.propTypes = {
  nfts: PropTypes.array
};
