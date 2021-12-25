import React, {useState} from 'react';
import PropTypes from 'prop-types';

export default function BannerForm({currentUser, contract}) {
  const [rawText, setRawText] = useState('');
  const [bannerText, setBannerText] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    setBannerText(await contract.generate_banner({text: rawText}));
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <form onSubmit={onSubmit}>
        <p>Hey <b>{currentUser.accountId}</b> 👋 Generate your own ASCII banner 🔥</p>
        <fieldset id="fieldset" style={{display: 'flex', flexDirection: 'column'}}>
          <p className="highlight">
            <label htmlFor="candidate">Text:</label>
            <input
              autoComplete="off"
              autoFocus
              id="text"
              required
              onChange={(event => setRawText(event.target.value))}
            />
          </p>
          <button type="submit"
                  disabled={!rawText.length}
                  style={{
                    margin: '0 10rem', ...((!rawText.length) && {
                      cursor: 'not-allowed',
                      pointerEvents: 'none',
                      border: '1px solid #999999',
                      backgroundColor: '#cccccc',
                      color: '#666666'
                    })
                  }}>
            Generate 🔤
          </button>
        </fieldset>
      </form>
      {bannerText.length !== 0 && <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '4rem'
      }}>
        <h2>ASCII Banner 🤩</h2>
        <pre style={{width: '100%', overflowX: 'auto', fontSize: 'xx-small', textAlign: 'center'}}>
          {bannerText}
        </pre>
      </div>}
    </div>
  );
}

BannerForm.propTypes = {
  contract: PropTypes.shape({
    generate_banner: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
