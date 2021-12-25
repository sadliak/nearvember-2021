import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function Form({onSubmit, currentUser, alreadyDonated}) {
    return (
        alreadyDonated
            ? <p>Hey <b>{currentUser.accountId}</b> 👋 You've already donated, thanks for being cool 😎!</p>
            : <form onSubmit={onSubmit}>
                <fieldset id="fieldset" style={{display: 'flex', flexDirection: 'column'}}>
                    <p>Hey <b>{currentUser.accountId}</b> 👋 Donate, be the cool kid 😎!</p>
                    <div style={{flexDirection: 'row'}}>
                        <p className="highlight">
                            <label htmlFor="message">Note:</label>
                            <input
                                autoComplete="off"
                                autoFocus
                                id="message"
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor="donation">Amount</label>
                            <input
                                autoComplete="off"
                                defaultValue={'0.1'}
                                id="donation"
                                max={Big(currentUser.balance).div(10 ** 24)}
                                min="0.1"
                                step="0.01"
                                type="number"
                            />
                            <span title="NEAR Tokens">Ⓝ</span>
                        </p>
                    </div>
                    <button type="submit" style={{margin: '0 10rem'}}>
                        Donate 💰
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
