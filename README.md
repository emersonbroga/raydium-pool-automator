# Raydium Pool Automator

A lightweight tool to automate interactions with Raydium pools on
Solana.

## Prerequisites

Before you begin, make sure you have the following installed:

-   **Node.js** (v18+ recommended)
-   **npm** or **yarn** 

## Installation

Clone the repository and install dependencies:

``` bash
git clone git@github.com:emersonbroga/raydium-pool-automator.git
cd raydium-pool-automator
npm install
```

## Configuration

Create a `.env` file in the root of the project.

You can either follow the instructions shown in the console when running
the project, or create it manually with the following variables:

``` env
SEED="your seed words"
WALLET="your-wallet-address"
```

> ⚠️ **Security warning**\
> Never commit your `.env` file or share your seed phrase.\
> Make sure `.env` is listed in your `.gitignore`.

## Running the Project

Start the development process with:

``` bash
npm run dev
```

Follow the interactive instructions in the console to complete the setup
and automation flow.

## Notes

-   This project is intended for educational and experimental use.
-   Use at your own risk when interacting with real funds.
-   Always test with small amounts first.

## Disclaimer

This project is provided **for educational and experimental purposes only**.

It does **not** constitute financial advice, investment advice, trading advice, or any other form of professional advice. Use of this software is entirely at your own risk.

Cryptocurrency markets are highly volatile, and interacting with on-chain protocols (including Raydium and other Solana-based programs) carries inherent risks, including but not limited to:

- Loss of funds
- Smart contract vulnerabilities
- Network congestion or failures
- Front-running, MEV, or unexpected protocol behavior
- Wallet compromise due to improper key or seed handling

By using this software, you acknowledge that:

- You are solely responsible for any transactions executed using this tool.
- You understand the risks associated with blockchain technology and decentralized finance (DeFi).
- The authors and contributors of this project are **not responsible** for any financial losses, damages, or liabilities arising from the use or misuse of this software.

You should **never** use funds you cannot afford to lose. Always review the source code, test with small amounts, and verify all parameters before interacting with real assets.
