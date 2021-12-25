# NEARvember 2021

## Prerequisites

* [node.js](https://www.nodejs.org) - 14.x.x+

    * Follow instructions to install [nvm](https://github.com/nvm-sh/nvm)
    * Run `nvm` commands
      ```shell
      $ nvm install lts/fermium
      $ nvm use lts/fermium
      ```

* [rust](https://rustlang.org) - 1.56.x+
    * Install `rustup` toolchain and install `wasm32-unknown-unknown` target
      ```shell
      $ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh rustup target add wasm32-unknown-unknown
      ```
