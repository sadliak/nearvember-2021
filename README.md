# NEARvember 2021

## Prerequisites

* [node.js](https://www.nodejs.org) - 14.x.x+

    * Follow instructions to install [nvm](https://github.com/nvm-sh/nvm)
    * Run `nvm` commands
      ```shell
      $ nvm install lts/fermium
      $ nvm use lts/fermium
      ```
    * Install `yarn`
      ```shell
      $ npm install -g yarn
      ```

* [rust](https://rustlang.org) - 1.56.x+
    * Install `rustup` toolchain and install `wasm32-unknown-unknown` target
      ```shell
      $ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh rustup target add wasm32-unknown-unknown
      ```

## NEAR commands

* Authorise NEAR CLI to use your NEAR Wallet account
    ```shell
    $ near login
    ```

* Create NEAR sub-account
    ```shell
    $ near create-account chN.near-to-the-moon.testnet --masterAccount near-to-the-moon.testnet --initialBalance 5
    ```

* Delete NEAR sub-account
    ```shell
    $ near delete chN.near-to-the-moon.testnet near-to-the-moon.testnet
    ```

* Deploy NEAR smart contract
    ```shell
    $ near deploy --accountId chN.near-to-the-moon.testnet --wasmFile <wasm-file>
    ```

* Call NEAR smart contract
    ```shell
    $ near call --accountId chN.near-to-the-moon.testnet <contract> <method> <method-args>
    ```
