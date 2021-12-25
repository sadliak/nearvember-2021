import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

export default function Candidates({currentUser, contract}) {
  const [ownVote, setOwnVote] = useState(null);
  const [candidates, setCandidates] = useState([]);

  const reloadOwnVote = async () => {
    const ownVote = await contract.myVote({senderId: currentUser.accountId});

    setOwnVote(ownVote?.candidate);
  };
  const reloadCandidates = async () => {
    const candidates = await contract.stats();
    setCandidates(candidates);
  };
  const vote = async (candidate) => {
    await contract.vote({candidate: candidate.name});
    await reloadOwnVote();
  };
  const unvote = async (candidate) => {
    await contract.unvote({candidate: candidate.name});
    await reloadOwnVote();
  };

  const loadTop3Emoji = (rank) => {
    if (rank === 1) {
      return '🏆🏆🏆';
    }

    if (rank === 2) {
      return '🏆🏆';
    }

    if (rank === 3) {
      return '🏆';
    }

    return '';
  };

  useEffect(() => {
    reloadOwnVote().then();
    reloadCandidates().then();
  }, []);

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2rem'
      }}>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <h2>President Election Candidates 🏆</h2>
          <button style={{marginLeft: '1rem'}} onClick={reloadCandidates}>
            ↻
          </button>
        </div>
        {candidates.length === 0 && <p style={{textAlign: 'center'}}>There are no registered candidates yet 🌵</p>}
        {candidates.map((candidate, i) =>
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '70%'
          }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{fontWeight: 'bold'}}>#{i + 1}. {candidate.name} {loadTop3Emoji(i + 1)}</span>
              <span>🗳 Votes: {candidate.voteCount}</span>
            </div>
            {candidate.name === ownVote?.name && <button onClick={() => unvote(candidate)}>
              Unvote ❌
            </button>}
            {!ownVote && <button onClick={() => vote(candidate)}>
              Vote ☑️
            </button>}
          </div>
        )}
      </div>
    </>
  );
}

Candidates.propTypes = {
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
