# GitRaven

Team : Coding? Type hi to karna hai

# Members

- Ankush Singh
- Ashutosh Mittal
- Aditya Berry
- Aryan Kesarwani
- Shivam Thakkar

# Problem Statement

Develop a web3 paltform where opensource project maintainers can list their projects and issues on chain to allow contributors to earn rewards like cryptocurrencies and NFTs and buidl up their contribution profile entirely on chain.

# How to setup

## Clone the repo

Fork and clone the repo

```bash
git clone git:github@<YOUR_USERNAME>/type-hi-to-karna-hai.git
cd type-hi-to-karna-hai
```

## Install dependencies

```bash
npm install
```

## Create a .env file

Create a .env file in the root of the project and add the following variables:

```bash
GITHUB_ID=GH_ID
GITHUB_SECRET=GH_SECRET
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random_string
INFURA_API_KEY=INF_KEY
PRIVATE_KEY=PVT_KEY
```

## Run the project

```bash
npm run dev
```

## Conpile Contract (Hardhat)

```bash
npx hardhat compile
```

## Deploy Contract (Hardhat)

```bash
npx hardhat run scripts/deploy.js --network zkEVM
```

```javascript
const contractAddress = "NEW_CONTRACT_ADDRESS";
```

And replace the contract abi file in `contracts/hack1.sol/hack1.json`

# Tech Stack
- NextJS
- TailwindCSS
- Solidity
- Hardhat
- EthersJS
- NextAuth
- Web3Modal
- Tensorflow
- Replit
- Flask
- Python
- Pytorch



