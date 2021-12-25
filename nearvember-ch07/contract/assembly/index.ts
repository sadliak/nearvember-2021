import {context, PersistentMap, PersistentSet} from "near-sdk-as";

const specialCandidateVotes = new Map<string, i32>();
specialCandidateVotes.set('Vladimir Putin', 146);
specialCandidateVotes.set('Putin', 146);
specialCandidateVotes.set('Dmitriy Medvedev', 146);
specialCandidateVotes.set('Medvedev', 146);

@nearBindgen
export class Candidate {
  name: string
  voteCount: i32

  constructor(name: string, voteCount: i32) {
    this.name = name;
    this.voteCount = voteCount;
  }
}

const candidates = new PersistentSet<string>("c");
const candidateVotes = new PersistentMap<string, i32>("cv");
const voterChoices = new PersistentMap<string, string>("vc");

export function myVote(): Candidate | null {
  if (!voterChoices.contains(context.sender)) {
    return null;
  }

  const candidateName = voterChoices.getSome(context.sender);
  const candidateVoteCount = candidateVotes.getSome(candidateName);

  return new Candidate(candidateName, candidateVoteCount);
}

export function stats(): Candidate[] {
  return candidates.values()
    .map<Candidate>((candidate) => new Candidate(candidate, candidateVotes.getSome(candidate)))
    .sort((a, b) => b.voteCount - a.voteCount);
}

export function unvote(candidate: string): string {
  if (!voterChoices.contains(context.sender)) {
    return `It seems you haven't voted yet. You need to vote first to be able to unvote later, consider using 'vote' method ✌️`;
  }

  if (!candidates.has(candidate)) {
    return `Candidate '${candidate}' is not registered yet. Use 'registerCandidate' method to register them 📍`;
  }

  const voterCandidate = voterChoices.getSome(context.sender);
  if (voterCandidate != candidate) {
    return `It seems you haven't voted for '${candidate}' candidate, so you can't remove your vote for him. You voted for '${voterCandidate}' candidate ℹ️️`;
  }

  const newVoteCount = candidateVotes.getSome(candidate) - 1;
  candidateVotes.set(candidate, newVoteCount);
  voterChoices.delete(context.sender);

  return `Thank you, your voice has been removed! Current vote count for '${candidate}' candidate is ${newVoteCount} 👌`
}

export function vote(candidate: string): string {
  if (voterChoices.contains(context.sender)) {
    return `Don't be sneaky, you have already voted 😏. If you want to change your vote use 'unvote' method to remove your previous one and vote again ✌️`;
  }

  if (!candidates.has(candidate)) {
    return `Candidate '${candidate}' is not registered yet. Use 'registerCandidate' method to register them 📍`;
  }

  const newVoteCount = candidateVotes.getSome(candidate) + 1;
  candidateVotes.set(candidate, newVoteCount);
  voterChoices.set(context.sender, candidate);

  return `Thank you, your voice has been registered! Current vote count for '${candidate}' candidate is ${newVoteCount} 👌`
}

export function registerCandidate(candidate: string): string {
  if (candidates.has(candidate)) {
    return `Candidate '${candidate}' is already registered ☑️`
  }

  candidates.add(candidate);

  // Add some unfair advantage to "special" candidates.
  const initialVoteCount = specialCandidateVotes.has(candidate)
    ? specialCandidateVotes.get(candidate)
    : 0;

  candidateVotes.set(candidate, initialVoteCount);

  return `Thank you, candidate '${candidate}' has been successfully registered ☑️`;
}
