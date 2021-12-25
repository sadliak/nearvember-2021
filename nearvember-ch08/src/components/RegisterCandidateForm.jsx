import React, {useMemo, useState} from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

export default function RegisterCandidateForm({currentUser, contract}) {
  const [candidate, setCandidate] = useState({name: '', isRegistered: false});

  const isCandidateRegistered = (candidate) => contract.isCandidateRegistered({candidate});
  const registerCandidate = (candidate) => contract.registerCandidate({candidate});

  const debouncedCandidateChangeHandler = useMemo(
    () => debounce(async (event) => {
      const prevCandidate = candidate.name;
      const newCandidate = event.target.value;

      if (prevCandidate === newCandidate) {
        console.log('Values are the same, no need to update');
        return;
      }

      const isCandidateAdded = await isCandidateRegistered(newCandidate);
      setCandidate({name: newCandidate, isRegistered: isCandidateAdded});
    }, 300),
    [candidate, setCandidate, isCandidateRegistered]
  );

  const onSubmit = async (event) => {
    event.preventDefault();

    const {fieldset} = event.target.elements;
    fieldset.disabled = true;

    await registerCandidate(candidate.name);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <form onSubmit={onSubmit}>
        <p>Hey <b>{currentUser.accountId}</b> 👋 Add your own contestant to this President Election Race 🏎</p>
        <fieldset id="fieldset" style={{display: 'flex', flexDirection: 'column'}}>
          <p className="highlight">
            <label htmlFor="candidate">Candidate:</label>
            <input
              autoComplete="off"
              autoFocus
              id="candidate"
              required
              onChange={debouncedCandidateChangeHandler}
            />
            <label htmlFor="candidate">Is Registered: {candidate.isRegistered ? '☑️' : '❌'}</label>
          </p>
          <button type="submit"
                  disabled={candidate.isRegistered}
                  style={{
                    margin: '0 10rem', ...((candidate.isRegistered) && {
                      cursor: 'not-allowed',
                      pointerEvents: 'none',
                      border: '1px solid #999999',
                      backgroundColor: '#cccccc',
                      color: '#666666'
                    })
                  }}>
            Add candidate 🏁
          </button>
        </fieldset>
      </form>
    </div>
  );
}

RegisterCandidateForm.propTypes = {
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
  })
};
