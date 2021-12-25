import 'regenerator-runtime/runtime'
import React from 'react'
import Reward from 'react-rewards';
import {login, logout} from './utils'
import './global.css'

import getConfig from './config'

const {networkId} = getConfig('testnet')

export default function App() {
    // use React Hooks to store greeting in component state
    const [fireReward, setFireReward] = React.useState()
    const [iceReward, setIceReward] = React.useState()
    const [shitReward, setShitReward] = React.useState()
    const [newGreeting, setNewGreeting] = React.useState()
    const [prevGreeting, setPrevGreeting] = React.useState()

    // when the user has not yet interacted with the form, disable the button
    const [buttonDisabled, setButtonDisabled] = React.useState(true)

    // after submitting the form, we want to show Notification
    const [showNotification, setShowNotification] = React.useState(false)

    // if not signed in, return early with sign-in prompt
    if (!window.walletConnection.isSignedIn()) {
        return (
            <main>
                <p style={{textAlign: 'center', marginTop: '2.5em'}}>
                    <button onClick={login}>Sign in</button>
                </p>
            </main>
        )
    }

    return (
        // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
        <>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <h6 style={{textAlign: 'center', color: 'var(--gray)'}}> Logged in as {window.accountId} </h6>
                <button className="link" onClick={logout}>
                    Sign out
                </button>
            </div>
            <main>
                <h1 style={{color: 'var(--fg)'}}>
                    {newGreeting}
                </h1>
                {prevGreeting && <h3 style={{color: 'var(--secondary)', textAlign: 'center'}}>
                    {prevGreeting}
                </h3>}
                <form onSubmit={async event => {
                    event.preventDefault()

                    // get elements from the form using their id attribute
                    const {fieldset, senderName, senderNumber} = event.target.elements

                    // disable the form while the value gets updated on-chain
                    fieldset.disabled = true

                    try {
                        // make an update call to the smart contract
                        const response = await window.contract.greet({
                            name: senderName.value,
                            ...((senderNumber && senderNumber.value) && {number: senderNumber.value})
                        })

                        const [part1, part2] = response.split('|');
                        setNewGreeting(part1.trimStart().trimEnd());
                        if (part1.includes('🔥')) {
                            fireReward.rewardMe()
                        }
                        if (part1.includes('🧊')) {
                            iceReward.rewardMe()
                        }
                        if (part1.includes('💩')) {
                            shitReward.rewardMe()
                        }

                        setPrevGreeting(part2 ? part2.trimStart().trimEnd() : '')
                    } catch (e) {
                        alert('Something went wrong! Maybe you need to sign out and back in? Check your browser console for more info.')
                        throw e
                    } finally {
                        // re-enable the form, whether the call succeeded or failed
                        fieldset.disabled = false
                    }

                    // show Notification
                    setShowNotification(true)

                    // remove Notification again after css animation completes
                    // this allows it to be shown again next time the form is submitted
                    setTimeout(() => {
                        setShowNotification(false)
                    }, 11000)
                }}>
                    <fieldset id="fieldset">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{alignItems: 'start'}}>
                                <label
                                    htmlFor="senderName"
                                    style={{
                                        display: 'block',
                                        color: 'var(--gray)',
                                        marginBottom: '0.5em'
                                    }}
                                >
                                    Tell me your name
                                </label>
                                <input
                                    autoComplete="off"
                                    id="senderName"
                                    onChange={e => setButtonDisabled(e.target.value.trim().length === 0)}
                                    style={{flex: 1}}
                                />
                            </div>
                            <div style={{alignItems: 'start'}}>
                                <label
                                    htmlFor="senderNumber"
                                    style={{
                                        display: 'block',
                                        color: 'var(--gray)',
                                        marginBottom: '0.5em'
                                    }}
                                >
                                    Try entering a number here 😏
                                </label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    id="senderNumber"
                                    style={{flex: 1}}
                                />
                            </div>
                            <button
                                disabled={buttonDisabled}
                                style={{borderRadius: '5px', display: 'block', marginTop: '1rem'}}
                            >
                                Submit
                            </button>
                            <Reward
                                ref={(ref) => {setFireReward(ref)}}
                                type='emoji'
                                config={{emoji: ['🔥']}}
                            >
                                {' '}
                            </Reward>
                            <Reward
                                ref={(ref) => {setIceReward(ref)}}
                                type='emoji'
                                config={{emoji: ['🧊']}}
                            >
                                {' '}
                            </Reward>
                            <Reward
                                ref={(ref) => {setShitReward(ref)}}
                                type='emoji'
                                config={{emoji: ['💩']}}
                            >
                                {' '}
                            </Reward>
                        </div>
                    </fieldset>
                </form>
            </main>
            {showNotification && <Notification/>}
        </>
    )
}

// this component gets rendered by App after the form is submitted
function Notification() {
    const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
    return (
        <aside>
            <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
                {window.accountId}
            </a>
            {' '/* React trims whitespace around tags; insert literal space character when needed */}
            called method: 'greet' in contract:
            {' '}
            <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
                {window.contract.contractId}
            </a>
            <footer>
                <div>✔ Succeeded</div>
                <div>Just now</div>
            </footer>
        </aside>
    )
}
