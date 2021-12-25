import { context, PersistentVector, PersistentSet, u128 } from "near-sdk-as";

/** 
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */
@nearBindgen
export class PostedMessage {
  text: string
  premium: boolean;
  sender: string;
  depositAmount: u128;
  blockTimestamp: u64;
  constructor(text: string) {
    this.text = text;
    this.sender = context.sender;
    this.depositAmount = context.attachedDeposit
    // Greater or equals to 5 NEAR.
    this.premium = context.attachedDeposit >= u128.from('5000000000000000000000000')
    this.blockTimestamp = context.blockTimestamp
  }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const messages = new PersistentVector<PostedMessage>("m");
export const users = new PersistentSet<string>("u");
