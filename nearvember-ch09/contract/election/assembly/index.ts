import {Context, ContractPromise, logging, PersistentMap, PersistentSet, u128} from 'near-sdk-as';

const OTHER_CONTRACT_NAME = 'ch09-2.near-to-the-moon.testnet';

@nearBindgen
class Candidate {
  name: string
  voteCount: i32

  constructor(name: string, voteCount: i32) {
    this.name = name;
    this.voteCount = voteCount;
  }
}

@nearBindgen
export class Response {
  message: string;
  candidate: Candidate | null;
  success: bool;

  constructor(message: string, candidate: Candidate | null, success: bool) {
    this.message = message;
    this.candidate = candidate;
    this.success = success;
  }
}

@nearBindgen
class GetInitialVoteCountArgs {
  candidate: string;
}

@nearBindgen
class RegisterCandidateCallbackArgs {
  candidate: string;
}

const candidates = new PersistentSet<string>("c");
const candidateVotes = new PersistentMap<string, i32>("cv");
const voterChoices = new PersistentMap<string, string>("vc");

export function myVote(senderId: string): Response {
  if (!voterChoices.contains(senderId)) {
    return new Response(`You haven't voted yet 🤷`, null, true);
  }

  const candidateName = voterChoices.getSome(senderId);
  const candidateVoteCount = candidateVotes.getSome(candidateName);

  return new Response(
    `Your vote was for '${candidateName}' candidate 😏`,
    new Candidate(candidateName, candidateVoteCount),
    true
  );
}

export function stats(): Candidate[] {
  return candidates.values()
    .map<Candidate>((candidate) => new Candidate(candidate, candidateVotes.getSome(candidate)))
    .sort((a, b) => b.voteCount - a.voteCount);
}

export function unvote(candidate: string): Response {
  if (!voterChoices.contains(Context.sender)) {
    return new Response(
      `It seems you haven't voted yet. You need to vote first to be able to unvote later, consider using 'vote' method ✌️`,
      null,
      false
    );
  }

  if (!candidates.has(candidate)) {
    return new Response(
      `Candidate '${candidate}' is not registered yet. Use 'registerCandidate' method to register them 📍`,
      null,
      false
    );
  }

  const voterCandidate = voterChoices.getSome(Context.sender);
  if (voterCandidate != candidate) {
    return new Response(
      `It seems you haven't voted for '${candidate}' candidate, so you can't remove your vote for him. You voted for '${voterCandidate}' candidate ℹ️️`,
      null,
      false
    );
  }

  const newVoteCount = candidateVotes.getSome(candidate) - 1;
  candidateVotes.set(candidate, newVoteCount);
  voterChoices.delete(Context.sender);

  return new Response(
    `Thank you, your voice has been removed! Current vote count for '${candidate}' candidate is ${newVoteCount} 👌`,
    new Candidate(candidate, newVoteCount),
    true
  );
}

export function vote(candidate: string): Response {
  if (voterChoices.contains(Context.sender)) {
    return new Response(
      `Don't be sneaky, you have already voted 😏. If you want to change your vote remove your previous one and vote again ✌️`,
      null,
      false
    );
  }

  if (!candidates.has(candidate)) {
    return new Response(
      `Candidate '${candidate}' is not registered yet. You might want to register them first 📍`,
      null,
      false
    );
  }

  const newVoteCount = candidateVotes.getSome(candidate) + 1;
  candidateVotes.set(candidate, newVoteCount);
  voterChoices.set(Context.sender, candidate);

  return new Response(
    `Thank you, your voice has been registered! Current vote count for '${candidate}' candidate is ${newVoteCount} 👌`,
    new Candidate(candidate, newVoteCount),
    true
  );
}

export function registerCandidate(candidate: string): void {
  ContractPromise.create<GetInitialVoteCountArgs>(
    OTHER_CONTRACT_NAME,
    'getInitialVoteCount',
    {
      candidate,
    },
    5_000_000_000_000,
    u128.Zero
  ).then<RegisterCandidateCallbackArgs>(
    Context.contractName,
    'registerCandidateCallback',
    {
      candidate
    },
    5_000_000_000_000,
    u128.Zero
  ).returnAsResult();
}

export function registerCandidateCallback(candidate: string): Response {
  if (candidates.has(candidate)) {
    const voteCount = candidateVotes.getSome(candidate);

    return new Response(
      `Candidate '${candidate}' is already registered ☑️`,
      new Candidate(candidate, voteCount),
      true
    );
  }

  const results = ContractPromise.getResults();
  assert(results.length == 1, "This is a callback method");
  const result = results[0];

  let initialVoteCount: i32;
  if (!result.succeeded) {
    logging.log(`Couldn't get initial vote count from '${OTHER_CONTRACT_NAME}' contract 😭 Defaulting to 0 👌`);
    initialVoteCount = 0;
  } else {
    initialVoteCount = result.decode<i32>();
  }

  candidates.add(candidate);
  candidateVotes.set(candidate, initialVoteCount);

  return new Response(
    `Thank you, candidate '${candidate}' has been successfully registered ☑️`,
    new Candidate(candidate, initialVoteCount),
    true
  );
}

export function isCandidateRegistered(candidate: string): bool {
  return candidates.has(candidate);
}
