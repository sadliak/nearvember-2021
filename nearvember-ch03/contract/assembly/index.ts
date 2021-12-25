import {Context, storage} from "near-sdk-core"

// Hack to do "optional" smart contract parameter.
const unlikelyNumber: i64 = 9007199254740991;

@nearBindgen
export class Contract {
  @mutateState()
  greet(name: string, number: i64 = unlikelyNumber): string {
    const lastFizzBuzzAnswer = this.getLastFizzBuzzAnswer(name);

    let greeting = `Hello ${name}!`;
    if (number !== unlikelyNumber) {
      const fizzBuzzAnswer = this.fizzBuzz(number);
      this.recordLastFizzbuzzAnswer(name, number, fizzBuzzAnswer);
      greeting = `${greeting} You entered ${number} number, your FizzBuzz answer is: ${fizzBuzzAnswer}`;
    } else {
      greeting = `${greeting} Try specifying 'number' parameter next time and see what it does 😏`;
    }

    if (lastFizzBuzzAnswer) {
      greeting = `${greeting}| Last FizzBuzz answer for '${name}' was: ${lastFizzBuzzAnswer}`;
    }

    return greeting;
  }

  private getLastFizzBuzzAnswer(name: string): string | null {
    const key = `${Context.sender}#${name}`;

    return storage.getString(key);
  }

  @mutateState()
  private recordLastFizzbuzzAnswer(name: string, number: i64, fizzBuzzAnswer: string): void {
    const key = `${Context.sender}#${name}`;
    const value = `${fizzBuzzAnswer} for ${number} number`;

    storage.setString(key, value);
  }

  private fizzBuzz(number: i64): string {
    if (number % 15 === 0) {
      return 'FizzBuzz 🔥🧊️';
    }

    if (number % 5 === 0) {
      return 'Buzz 🧊️️';
    }

    if (number % 3 === 0) {
      return 'Fizz 🔥';
    }

    return 'NOTHING 💩';
  }
}
