import {logging} from "near-sdk-as";

const unfairCandidateVotes = new Map<string, i32>();
unfairCandidateVotes.set('Vladimir Putin', 146);
unfairCandidateVotes.set('Putin', 146);
unfairCandidateVotes.set('Dmitriy Medvedev', 146);
unfairCandidateVotes.set('Medvedev', 146);

export function getInitialVoteCount(candidate: string): i32 {
  if (unfairCandidateVotes.has(candidate)) {
    const initialVoteCount = unfairCandidateVotes.get(candidate);

    logging.log(`Candidate '${candidate}' has unfair advantage of ${initialVoteCount} 🤯! Good luck against them 😏`);

    return initialVoteCount;
  }

  logging.log(`Candidate '${candidate}' doesn't have any unfair advantage 🥳`);

  return 0;
}
