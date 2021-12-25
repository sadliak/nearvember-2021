import 'regenerator-runtime/runtime';
import React from 'react';
import {login, logout} from './utils';
import './global.scss';

export default function App() {
    const [fizzBuzzNumber, setFizzBuzzNumber] = React.useState(null);
    const [fizzBuzzResponse, setFizzBuzzResponse] = React.useState('');

    const onClick = async () => {
        const response = await window.contract.fizzBuzz({number: `${fizzBuzzNumber}`});
        setFizzBuzzResponse(response);
    };

    // if not signed in, return early with sign-in prompt.
    if (!window.walletConnection.isSignedIn()) {
        return (
            <main>
                <h1>FizzBuzz 🔥</h1>
                <p style={{textAlign: 'center', marginTop: '2.5em'}}>
                    <button onClick={login}>Sign in</button>
                </p>
            </main>
        );
    }

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <p>Hey <b>{window.accountId}</b> 👋</p>
                <button onClick={logout}>
                    Sign out
                </button>
            </div>
            <main>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h2>Fizz Buzz 🔥</h2>
                    <p className="highlight">
                        <label htmlFor="candidate">Number:</label>
                        <input
                            type="number"
                            autoComplete="off"
                            autoFocus
                            id="num"
                            required
                            onChange={(event => setFizzBuzzNumber(event.target.value))}
                            style={{textAlign: 'left'}}
                        />
                    </p>
                    <button disabled={fizzBuzzNumber == null}
                            style={{
                                margin: '0 10rem', ...((fizzBuzzNumber == null) && {
                                    cursor: 'not-allowed',
                                    pointerEvents: 'none',
                                    border: '1px solid #999999',
                                    backgroundColor: '#cccccc',
                                    color: '#666666'
                                })
                            }}
                            onClick={onClick}>
                        Fizz Buzz? 🤔
                    </button>
                    {fizzBuzzResponse.length !== 0 && <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '4rem'
                    }}>
                        <p style={{width: '100%', fontSize: 'xxx-large', textAlign: 'center'}}>
                            {fizzBuzzResponse}
                        </p>
                    </div>}
                </div>
            </main>
        </>
    );
};
