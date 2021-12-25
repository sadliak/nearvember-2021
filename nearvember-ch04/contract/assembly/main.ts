import {context, u128} from "near-sdk-as";
import { PostedMessage, messages, users } from './model';

// The maximum number of messages the contract returns.
const MESSAGE_LIMIT = 50;

/**
 * Adds a new message under the name of the sender's account id.
 */
export function addMessage(text: string): void {
  // Creating a new message and populating fields with our data
  const message = new PostedMessage(text);
  if (users.has(context.sender)) {
    throw new Error('Sorry, but you have already submitted your donation, it could be done only once!');
  }

  messages.push(message);
  users.add(context.sender);
}

/**
 * Returns whether sender account has already donated.
 */
export function hasAlreadyDonated(senderAccount: string): bool {
  return users.has(senderAccount);
}

/**
 * Returns an array of last N messages.
 */
export function getMessages(): PostedMessage[] {
  const result = new Array<PostedMessage>(messages.length);
  for(let i = 0; i < messages.length; i++) {
    result[i] = messages[i];
  }

  const comparator = (a: PostedMessage, b: PostedMessage): i8 => {
    if (u128.gt(a.depositAmount, b.depositAmount)) {
      return -1;
    }

    if (u128.lt(a.depositAmount, b.depositAmount)) {
      return 1;
    }

    return 0;
  };

  return result
    .sort(comparator)
    .slice(0, min(MESSAGE_LIMIT, messages.length));
}
