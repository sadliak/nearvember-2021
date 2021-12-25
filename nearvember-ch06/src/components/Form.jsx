import React, {useEffect, useMemo} from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import Big from 'big.js';
import useStickyState from '../sticky-state';

const GAS = Big(3).times(10 ** 13).toFixed();
const MIN_PAYMENT = Big(0.000000000000000000000001).times(10 ** 24).toFixed();

export default function Form({currentUser, nearConfig, contract}) {
  const minAmount = 1;
  const [fromAccount, setFromAccount] = useStickyState(
    {accountId: nearConfig.contractName, balance: 0},
    'Form#fromAccount'
  );
  const [toAccount, setToAccount] = useStickyState(
    {accountId: currentUser.accountId, balance: 0},
    'Form#toAccount'
  );
  const [toAccountStorageDepositPaid, setToAccountStorageDepositPaid] = useStickyState(
    false,
    'Form#toAccountStorageDepositPaid'
  );
  const [amount, setAmount] = useStickyState(
    minAmount,
    'Form#amount'
  );

  const getBalance = (accountId) => contract.ft_balance_of({account_id: accountId});
  const payStorageDeposit = () => contract.storage_deposit({}, GAS, Big(0.00125).times(10 ** 24).toFixed());
  const transfer = (toAccountId, amount) => contract.ft_transfer(
    {receiver_id: toAccountId, amount: `${amount}`},
    GAS,
    MIN_PAYMENT
  );

  useEffect(() => {
    getBalance(fromAccount.accountId)
      .then((balance) => setFromAccount({accountId: fromAccount.accountId, balance}));
    getBalance(toAccount.accountId)
      .then((balance) => {
        setToAccount({accountId: toAccount.accountId, balance})
        setToAccountStorageDepositPaid(Boolean(Number(balance)));
      });
  }, []);

  const debouncedToAccountChangeHandler = useMemo(
    () => debounce(async (event) => {
      const prevAccountId = toAccount.accountId;
      const newAccountId = event.target.value;

      if (prevAccountId === newAccountId) {
        console.log('Values are the same, no need to update');
        return;
      }

      const newAccountBalance = Number(await getBalance(newAccountId));
      setToAccount({accountId: newAccountId, balance: newAccountBalance})
      setToAccountStorageDepositPaid(Boolean(newAccountBalance));
    }, 300),
    [toAccount, setToAccount, setToAccountStorageDepositPaid, getBalance]
  );

  const onSubmit = async (event) => {
    console.log(event);
    event.preventDefault();

    const {fieldset} = event.target.elements;
    fieldset.disabled = true;

    console.log(toAccount.accountId);
    console.log(amount);
    await transfer(toAccount.accountId, amount);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <form onSubmit={onSubmit}>
        <p>Hey <b>{currentUser.accountId}</b> 👋 Get your piece of NEARvana, rock on 🤘</p>
        <fieldset id="fieldset" style={{display: 'flex', flexDirection: 'column'}}>
          <p className="highlight">
            <label htmlFor="from">👆From:</label>
            <input
              autoComplete="off"
              autoFocus
              id="from"
              defaultValue={fromAccount.accountId}
              required
              disabled={true}
            />
            <label htmlFor="from">Balance: {fromAccount.balance}</label>
          </p>
          <p className="highlight">
            <label htmlFor="to">👇To:</label>
            <input
              autoComplete="off"
              autoFocus
              id="to"
              defaultValue={toAccount.accountId}
              required
              onChange={debouncedToAccountChangeHandler}
            />
            <label htmlFor="to">Balance: {toAccount.balance}</label>
          </p>
          <p className="highlight">
            <label htmlFor="amount">💰Amount:</label>
            <input
              autoComplete="off"
              defaultValue={amount}
              id="amount"
              max={fromAccount.balance}
              min={minAmount}
              step="1"
              type="number"
              required
              onChange={(event) => setAmount(event.target.value)}
              style={{textAlign: 'start'}}
            />
          </p>
          {!toAccountStorageDepositPaid && <div style={{display: 'flex', flexDirection: 'column'}}>
            <p style={{textAlign: 'center'}}>
              ⚠️ NEARvana balance of <strong>{toAccount.accountId}</strong> is {toAccount.balance}, you might want to
              pay storage deposit for this account
            </p>
            <button style={{margin: '0 10rem'}} disabled={toAccountStorageDepositPaid} onClick={payStorageDeposit}>
              Pay NEARvana storage deposit 💰
            </button>
          </div>}
          <button type="submit"
                  disabled={fromAccount.balance < amount}
                  style={{
                    margin: '0 10rem', ...((fromAccount.balance < amount) && {
                      cursor: 'not-allowed',
                      pointerEvents: 'none',
                      border: '1px solid #999999',
                      backgroundColor: '#cccccc',
                      color: '#666666'
                    })
                  }}>
            Rock on 🤘
          </button>
        </fieldset>
      </form>
    </div>
  );
}

Form.propTypes = {
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
  }).isRequired
};
